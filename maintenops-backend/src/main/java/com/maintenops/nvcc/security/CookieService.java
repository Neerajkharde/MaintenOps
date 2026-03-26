package com.maintenops.nvcc.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Getter
public class CookieService {

    private final String refreshTokenCookieName;
    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;
    private final String cookieSameSite;

    private final String cookieDomain;

    public CookieService(
            @Value("${security.jwt.refresh-token-cookie-name}") String refreshTokenCookieName,
            @Value("${security.jwt.cookie-http-only}") boolean cookieHttpOnly,
            @Value("${security.jwt.cookie-secure}") boolean cookieSecure,
            @Value("${security.jwt.cookie-same-site}") String cookieSameSite,
            @Value("${security.jwt.cookie-domain}") String cookieDomain
    ) {
        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieSameSite = cookieSameSite;
        this.cookieDomain = cookieDomain;
    }

    // Attach refresh token cookie
    public void attachRefreshCookie(HttpServletResponse response, String value, int maxAge) {

        ResponseCookie responseCookie = ResponseCookie.from(refreshTokenCookieName, value)
                .secure(cookieSecure)           // must be true for HTTPS
                .httpOnly(cookieHttpOnly)
                .path("/")
                .domain(cookieDomain)
                .sameSite(cookieSameSite)       // must be "None"
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    // Clear refresh cookie
    public void clearRefreshCookie(HttpServletResponse response) {

        ResponseCookie responseCookie = ResponseCookie.from(refreshTokenCookieName, "")
                .secure(cookieSecure)
                .httpOnly(cookieHttpOnly)
                .path("/")
                .domain(cookieDomain)
                .sameSite(cookieSameSite)
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    // Prevent caching of sensitive responses
    public void addNoStoreHeaders(HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        response.setHeader("Pragma", "no-cache");
    }
}