package com.maintenops.nvcc.services.impls;

import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.maintenops.nvcc.config.GoogleDriveStorageConfig;
import com.maintenops.nvcc.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleDriveStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(GoogleDriveStorageServiceImpl.class);
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png");
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final Drive googleDrive;
    private final GoogleDriveStorageConfig config;

    @Override
    public List<String> storeImages(MultipartFile[] files, String requestNumber) {
        List<String> storedPaths = new ArrayList<>();

        if (files == null || files.length == 0) {
            return storedPaths;
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            validateFile(file);
            String extension = getFileExtension(file.getOriginalFilename());
            String uniqueFileName = requestNumber + "-" + UUID.randomUUID() + extension;

            String fileId = uploadToDrive(file, uniqueFileName);
            storedPaths.add(fileId);
            log.info("Uploaded image to Google Drive: {}", fileId);
        }

        return storedPaths;
    }

    @Override
    public String getImageUrl(String fileId) {
        // Return a proxy link to our backend instead of Google Drive directly
        return "/api/images/" + fileId;
    }

    @Override
    public byte[] downloadImage(String fileId) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            googleDrive.files().get(fileId).executeMediaAndDownloadTo(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error("Failed to download file from Google Drive: {}", fileId, e);
            throw new RuntimeException("Failed to download image from Google Drive: " + fileId, e);
        }
    }

    private String uploadToDrive(MultipartFile multipartFile, String fileName) {
        try {
            File fileMetadata = new File();
            fileMetadata.setName(fileName);
            fileMetadata.setParents(Collections.singletonList(config.getFolderId()));

            InputStreamContent mediaContent = new InputStreamContent(
                    multipartFile.getContentType(),
                    multipartFile.getInputStream());

            File uploadedFile = googleDrive.files().create(fileMetadata, mediaContent)
                    .setFields("id, webViewLink, webContentLink")
                    .execute();

            // Set permissions so anyone with the link can view it (required for frontend display)
            Permission permission = new Permission()
                    .setType("anyone")
                    .setRole("reader");
            googleDrive.permissions().create(uploadedFile.getId(), permission).execute();

            return uploadedFile.getId();
        } catch (IOException e) {
            log.error("Failed to upload file to Google Drive: {}", fileName, e);
            throw new RuntimeException("Failed to upload image to Google Drive: " + fileName, e);
        }
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException("Only JPG and PNG images are allowed. Got: " + contentType);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5 MB limit: " + file.getOriginalFilename());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
