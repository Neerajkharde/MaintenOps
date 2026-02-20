package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.entities.RefreshToken;
import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.repositories.RefreshTokenRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.security.CookieService;
import com.maintenops.nvcc.security.JwtService;
import com.maintenops.nvcc.services.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RefreshTokenRepository rtRepo;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthenticationManager authenticationManager;

    // Register the user
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserRequestDto userRequestDto) {
        UserResponseDto response = userService.createUser(userRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private Authentication authenticate(LoginRequest request) {
        try{

            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
            ));

        } catch (Exception e) {
            throw new BadCredentialsException("Authentication failed: Invalid Username or Password");
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletResponse response){
        // 1️. Authenticate email + password
        Authentication authentication = authenticate(request);

        // 2️. Fetch authenticated user (guaranteed valid credentials)
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));


        // 3. Generate tokens
        String accessToken = jwtService.generateAccessToken(user);

        // 4. Prepare refresh token metadata
        String jti = UUID.randomUUID().toString();
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
        String refreshToken = jwtService.generateRefreshToken(user, jti);

//         7️. Attach refresh token as HttpOnly cookie
        cookieService.attachRefreshCookie(
                response,
                refreshToken,
                (int) jwtService.getRefreshTtlSeconds()
        );
        cookieService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(
                accessToken,
                jwtService.getAccessTtlSeconds(),
                new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getOrganizationDepartment() != null
                                ? user.getOrganizationDepartment().getName()
                                : null,
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName().name())
                                .collect(Collectors.toSet())
                )
        );

        return ResponseEntity.ok(tokenResponse);

    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest body,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String refreshToken = readRefreshTokenFromRequest(request, body)
                .orElseThrow(()-> new BadCredentialsException("Refresh token is missing"));

        if(!jwtService.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid Refresh Token");
        }

        String jti = jwtService.getJti(refreshToken);
        Long userId = jwtService.getUserId(refreshToken);

        RefreshToken savedRefreshToken = rtRepo.findByJti(jti)
                .orElseThrow(()-> new BadCredentialsException("Refresh Token not recognised"));

        if(savedRefreshToken.isRevoked()){
            throw new BadCredentialsException("Refresh Token in expired or revoked");
        }

        if(savedRefreshToken.getExpiresAt().isBefore(Instant.now())){
            throw new BadCredentialsException("Refresh Token is expired");
        }

        if(!savedRefreshToken.getUser().getId().equals(userId)){
            throw new BadCredentialsException("Refresh Token does not belong to current user");
        }

        // Now rotate the refresh token so that one cant use this refresh token again
        savedRefreshToken.setRevoked(true);
        String newJti = UUID.randomUUID().toString();
        savedRefreshToken.setReplacedByToken(newJti); // So now new Jti of this RT is newJti
        rtRepo.save(savedRefreshToken); // Update in DB

        // Now I will create the refresh token corresponding to this newJti
        User user = savedRefreshToken.getUser();

        // This is made to save in Repository
        RefreshToken toBeSavedRT = RefreshToken.builder()
                .jti(newJti)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .user(user)
                .revoked(false)
                .build();
        rtRepo.save(toBeSavedRT);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user, newJti);

        cookieService.attachRefreshCookie(response, newRefreshToken, (int)jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(
                newAccessToken,
                jwtService.getAccessTtlSeconds(),
                new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getOrganizationDepartment() != null
                                ? user.getOrganizationDepartment().getName()
                                : null,
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName().name())
                                .collect(Collectors.toSet())
                ));
        return ResponseEntity.ok(tokenResponse);
    }

    // Now Logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        readRefreshTokenFromRequest(request, null).ifPresent(rt->{
            try {
                if(jwtService.isRefreshToken(rt)){
                    String jti = jwtService.getJti(rt);
                    rtRepo.findByJti(jti).ifPresent(token->{
                        token.setRevoked(true);
                        //Update in DB
                        rtRepo.save(token);
                    });
                }
            }catch (JwtException ignored){}
        });

        cookieService.clearRefreshCookie(response);
        cookieService.addNoStoreHeaders(response);

        SecurityContextHolder.clearContext(); // Hence logged out -> removed authentication from the Security Context
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Reading refresh token from the cookie
    private Optional<String> readRefreshTokenFromRequest(HttpServletRequest request, RefreshTokenRequest body) {
        // Prefer reading refresh token from the cookie
        if(request.getCookies() != null) {
            Optional<String> fromCookie = Arrays.stream(request.getCookies())
                    .filter(c -> cookieService.getRefreshTokenCookieName().equals(c.getName()))
                    .map(Cookie::getValue)
                    .filter(v -> !v.isBlank())
                    .findFirst();

            if(fromCookie.isPresent()) return fromCookie;
        }

        // if from body:
        if(body!=null && body.refreshToken()!=null && !body.refreshToken().isBlank()){
            return Optional.of(body.refreshToken());
        }

        // Refresh Token can come from Custom Header or it can be -> Authorization = Bearer <token>
        return Optional.empty();
    }


}
