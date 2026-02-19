package com.maintenops.nvcc.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                // Allow ONLY access tokens
                if (!jwtService.isAccessToken(token)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // Parse token
                Jws<Claims> parsed = jwtService.parse(token);
                Claims claims = parsed.getPayload();

                // Extract userId (subject)
                Long userId = Long.valueOf(claims.getSubject());

                String username = claims.get("username", String.class);
                String email = claims.get("email", String.class);
                Long orgDeptId = claims.get("orgDeptId", Long.class);

                // Extract roles (List<String>)
                List<String> roleStrings = claims.get("roles", List.class);

                List<GrantedAuthority> authorities = roleStrings.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                // Build Principal
                JwtPrincipal principal = new JwtPrincipal(
                        userId,
                        username,
                        email,
                        orgDeptId,
                        roleStrings
                );

                // Set Authentication if not already set
                if (SecurityContextHolder.getContext().getAuthentication() == null) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    principal,
                                    null,
                                    authorities
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }

            } catch (ExpiredJwtException e) {
                request.setAttribute("error", "Token Expired");
            } catch (Exception e) {
                request.setAttribute("error", "Invalid Token");
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/auth");
    }
}
