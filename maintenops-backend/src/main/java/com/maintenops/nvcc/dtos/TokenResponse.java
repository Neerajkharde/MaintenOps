package com.maintenops.nvcc.dtos;

public record TokenResponse(
        String accessToken,
        long expiresIn,
        String tokenType, // Bearer by default
        UserResponseDto user
) {
    public static TokenResponse of(String accessToken, long expiresIn, UserResponseDto user) {
        return new TokenResponse(accessToken, expiresIn, "Bearer", user);
    }

}

