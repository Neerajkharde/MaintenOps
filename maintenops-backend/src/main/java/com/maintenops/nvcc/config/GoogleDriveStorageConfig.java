package com.maintenops.nvcc.config;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Configuration for Google Drive integration using OAuth2 user credentials.
 * Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */
@Configuration
@ConfigurationProperties(prefix = "google.drive")
@Getter
@Setter
public class GoogleDriveStorageConfig {

    /**
     * Folder ID in Google Drive where images will be uploaded.
     */
    private String folderId;

    /**
     * OAuth2 Client ID from Google Cloud Console.
     */
    private String clientId;

    /**
     * OAuth2 Client Secret from Google Cloud Console.
     */
    private String clientSecret;

    /**
     * OAuth2 Refresh Token obtained via the authorization flow.
     */
    private String refreshToken;

    @Bean
    public Drive googleDriveService() throws GeneralSecurityException, IOException {
        if (clientId == null || clientId.isBlank()
                || clientSecret == null || clientSecret.isBlank()
                || refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalStateException(
                    "Google Drive OAuth2 credentials are missing! Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables are set.");
        }

        GoogleCredential credential = new GoogleCredential.Builder()
                .setTransport(GoogleNetHttpTransport.newTrustedTransport())
                .setJsonFactory(GsonFactory.getDefaultInstance())
                .setClientSecrets(clientId, clientSecret)
                .build()
                .setRefreshToken(refreshToken);

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                credential)
                .setApplicationName("MaintenOps")
                .build();
    }
}
