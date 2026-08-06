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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Configuration for Google Drive integration.
 * Requires a Service Account JSON loaded in via environment variable: GOOGLE_CREDENTIALS_JSON
 */
@Configuration
@ConfigurationProperties(prefix = "google.drive")
@Getter
@Setter
public class GoogleDriveStorageConfig {

    /**
     * Folder ID in Google Drive where images will be uploaded. (e.g. 1a2b3c4d5e)
     */
    private String folderId;

    /**
     * The absolute path to the credentials.json or the raw JSON string itself.
     * Expected env: GOOGLE_CREDENTIALS_JSON
     */
    private String credentialsJson;

    @Bean
    public Drive googleDriveService() throws GeneralSecurityException, IOException {
        if (credentialsJson == null || credentialsJson.isBlank()) {
            throw new IllegalStateException("Google Drive credentials JSON is missing! Ensure GOOGLE_CREDENTIALS_JSON environment variable is set.");
        }

        GoogleCredential credential = GoogleCredential.fromStream(new ByteArrayInputStream(credentialsJson.getBytes()))
                .createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                credential)
                .setApplicationName("MaintenOps")
                .build();
    }
}
