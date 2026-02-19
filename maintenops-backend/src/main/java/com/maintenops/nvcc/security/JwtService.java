package com.maintenops.nvcc.security;

import com.maintenops.nvcc.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
@Getter
@Setter
public class JwtService {
    private final SecretKey key;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-ttl-seconds}") long accessTtlSeconds,
            @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
            @Value("${security.jwt.issuer}") String issuer
    ) {

        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException("JWT secret must be at least 64 characters");
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;
    }

    public String generateAccessToken(User user) {

        Instant now = Instant.now();

        List<String> roles = user.getRoles()
                .stream()
                .map(role -> "ROLE_" + role.getName())
                .toList();

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("roles", roles);
        claims.put(
                "orgDeptId",
                user.getOrganizationDepartment() != null
                        ? user.getOrganizationDepartment().getId()
                        : null
        );
        claims.put("typ", "access");

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .claims(claims)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(User user, String jti) {

        Instant now = Instant.now();

        return Jwts.builder()
                .id(jti)
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .claims(Map.of("typ", "refresh"))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }

    public boolean isAccessToken(String token) {
        Claims claims = parse(token).getPayload();
        return "access".equals(claims.get("typ"));
    }

    public boolean isRefreshToken(String token) {
        Claims claims = parse(token).getPayload();
        return "refresh".equals(claims.get("typ"));
    }

    public Long getUserId(String token) {
        Claims claims = parse(token).getPayload();
        String sub = claims.getSubject();
        if (sub == null) {
            throw new IllegalStateException("JWT subject is missing");
        }
        return Long.valueOf(sub);
    }

    public String getUsername(String token) {
        Claims claims = parse(token).getPayload();
        return (String) claims.get("username");
    }

    public String getEmail(String token) {
        Claims claims = parse(token).getPayload();
        return (String) claims.get("email");
    }

    public List<String> getRoles(String token) {
        Claims claims = parse(token).getPayload();
        return claims.get("roles", List.class);
    }

    public Long getOrgDeptId(String token) {
        Claims claims = parse(token).getPayload();
        return claims.get("orgDeptId", Long.class);
    }

    public String getJti(String token) {
        Claims claims = parse(token).getPayload();
        return claims.getId();
    }

    public boolean isExpired(String token) {
        Date expiration = parse(token).getPayload().getExpiration();
        return expiration.before(new Date());
    }


}
