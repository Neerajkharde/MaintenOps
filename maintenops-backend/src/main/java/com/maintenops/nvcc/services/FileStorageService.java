package com.maintenops.nvcc.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service for handling file storage operations.
 */
public interface FileStorageService {

    /**
     * Store multiple image files for a request.
     *
     * @param files array of MultipartFile images
     * @param requestNumber the request number used to organize files
     * @return list of stored file paths (relative to upload root)
     */
    List<String> storeImages(MultipartFile[] files, String requestNumber);

    /**
     * Get the public URL path for a stored image.
     *
     * @param filePath the stored file path
     * @return the URL path accessible via HTTP
     */
    String getImageUrl(String filePath);
}
