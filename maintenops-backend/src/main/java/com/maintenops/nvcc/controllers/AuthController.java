package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.LoginRequest;
import com.maintenops.nvcc.dtos.TokenResponse;
import com.maintenops.nvcc.dtos.UserRequestDto;
import com.maintenops.nvcc.dtos.UserResponseDto;
import com.maintenops.nvcc.entities.RefreshToken;
import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.repositories.RefreshTokenRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.security.CookieService;
import com.maintenops.nvcc.security.JwtService;
import com.maintenops.nvcc.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
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


}
