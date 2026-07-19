package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.services.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Local filesystem implementation of FileStorageService.
 * Stores uploaded images under the configured upload directory.
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadPath, e);
        }
    }

    @Override
    public List<String> storeImages(MultipartFile[] files, String requestNumber) {
        List<String> storedPaths = new ArrayList<>();

        if (files == null || files.length == 0) {
            return storedPaths;
        }

        // Create a subdirectory per request for organization
        Path requestDir = uploadPath.resolve("requests").resolve(requestNumber);
        try {
            Files.createDirectories(requestDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create request image directory", e);
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                throw new RuntimeException("Only JPG and PNG images are allowed. Got: " + contentType);
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 5MB limit: " + file.getOriginalFilename());
            }

            // Generate unique filename to avoid collisions
            String extension = getFileExtension(file.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            try {
                Path targetPath = requestDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                // Store relative path: requests/{requestNumber}/{filename}
                storedPaths.add("requests/" + requestNumber + "/" + uniqueFileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image: " + file.getOriginalFilename(), e);
            }
        }

        return storedPaths;
    }

    @Override
    public String getImageUrl(String filePath) {
        return "/uploads/" + filePath;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg"; // default
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
