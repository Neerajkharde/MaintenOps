package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.config.SupabaseStorageConfig;
import com.maintenops.nvcc.services.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Supabase Storage implementation of {@link FileStorageService}.
 *
 * <p>Uploads images to a private Supabase Storage bucket via the REST API
 * and generates time-limited signed URLs for retrieval.</p>
 *
 * <h3>Supabase Storage REST API endpoints used:</h3>
 * <ul>
 *   <li><b>Upload:</b> {@code POST /storage/v1/object/{bucket}/{objectPath}}</li>
 *   <li><b>Signed URL:</b> {@code POST /storage/v1/object/sign/{bucket}/{objectPath}}</li>
 * </ul>
 *
 * <p>The service-role key is used for all operations, bypassing RLS policies.
 * This key must <b>never</b> be exposed to clients.</p>
 */
@Service
public class SupabaseStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageServiceImpl.class);

    /**
     * Allowed MIME types for upload validation.
     */
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png");

    /**
     * Maximum file size in bytes (5 MB).
     */
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final RestClient restClient;
    private final SupabaseStorageConfig config;

    public SupabaseStorageServiceImpl(
            @Qualifier("supabaseRestClient") RestClient restClient,
            SupabaseStorageConfig config) {
        this.restClient = restClient;
        this.config = config;
    }

    // ======================== PUBLIC API ========================

    /**
     * Uploads multiple images to Supabase Storage under
     * {@code requests/{requestNumber}/{uuid}.{ext}}.
     *
     * @param files         array of multipart files to upload
     * @param requestNumber the maintenance-request identifier used as a folder name
     * @return list of object paths stored in the bucket (same format as the old local impl)
     * @throws RuntimeException on validation failure or upload error
     */
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
            String uniqueFileName = UUID.randomUUID() + extension;
            // Mirror the old directory structure inside the bucket
            String objectPath = "requests/" + requestNumber + "/" + uniqueFileName;

            uploadToSupabase(file, objectPath);

            storedPaths.add(objectPath);
            log.info("Uploaded image to Supabase Storage: {}", objectPath);
        }

        return storedPaths;
    }

    /**
     * Generates a time-limited signed URL for a privately-stored image.
     *
     * @param filePath the object path in the bucket (e.g. {@code requests/REQ-2026-1234/uuid.jpg})
     * @return a fully-qualified signed URL valid for the configured expiry period
     * @throws RuntimeException if signed URL generation fails
     */
    @Override
    public String getImageUrl(String filePath) {
        return createSignedUrl(filePath);
    }

    // ======================== PRIVATE HELPERS ========================

    /**
     * Validates the uploaded file against allowed types and maximum size.
     */
    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException(
                    "Only JPG and PNG images are allowed. Got: " + contentType);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException(
                    "File size exceeds 5 MB limit: " + file.getOriginalFilename()
                            + " (" + (file.getSize() / 1024) + " KB)");
        }
    }

    /**
     * Uploads a single file to Supabase Storage.
     *
     * <p>Endpoint: {@code POST /storage/v1/object/{bucket}/{objectPath}}</p>
     * <p>The file bytes are sent as the raw request body with the appropriate Content-Type.</p>
     */
    private void uploadToSupabase(MultipartFile file, String objectPath) {
        try {
            byte[] fileBytes = file.getBytes();
            String contentType = file.getContentType();

            restClient.post()
                    .uri("/storage/v1/object/{bucket}/{objectPath}", config.getBucket(), objectPath)
                    .contentType(MediaType.parseMediaType(contentType))
                    .header("cache-control", "max-age=3600")
                    .header("x-upsert", "false")
                    .body(fileBytes)
                    .retrieve()
                    .toBodilessEntity();

            log.debug("Supabase upload succeeded for object: {}", objectPath);

        } catch (IOException e) {
            log.error("Failed to read file bytes for upload: {}", objectPath, e);
            throw new RuntimeException(
                    "Failed to read file for upload: " + file.getOriginalFilename(), e);
        } catch (Exception e) {
            log.error("Supabase upload failed for object: {}", objectPath, e);
            throw new RuntimeException(
                    "Failed to upload image to Supabase Storage: " + file.getOriginalFilename(), e);
        }
    }

    /**
     * Creates a signed URL for a private object in Supabase Storage.
     *
     * <p>Endpoint: {@code POST /storage/v1/object/sign/{bucket}/{objectPath}}</p>
     * <p>Request body: {@code {"expiresIn": <seconds>}}</p>
     * <p>Response body: {@code {"signedURL": "/object/sign/..."}}</p>
     *
     * The returned {@code signedURL} is a relative path; we prepend the Supabase
     * project URL to produce an absolute URL.
     */
    private String createSignedUrl(String filePath) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri("/object/sign/{bucket}/{objectPath}", config.getBucket(), filePath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("expiresIn", config.getSignedUrlExpirySeconds()))
                    .retrieve()
                    .body(Map.class);

            if (response == null || !response.containsKey("signedURL")) {
                throw new RuntimeException(
                        "Supabase returned an unexpected response when creating signed URL for: " + filePath);
            }

            // signedURL is relative, e.g. "/object/sign/bucket/requests/..."
            String signedPath = (String) response.get("signedURL");

            // Build the full URL: project base + /storage/v1 + signedPath
            String fullUrl = config.getUrl() + "/storage/v1" + signedPath;

            log.debug("Generated signed URL for {}: {}", filePath, fullUrl);
            return fullUrl;

        } catch (RuntimeException e) {
            // Re-throw our own exceptions as-is
            if (e.getMessage() != null && e.getMessage().startsWith("Supabase returned")) {
                throw e;
            }
            log.error("Failed to create signed URL for: {}", filePath, e);
            throw new RuntimeException(
                    "Failed to generate signed URL for image: " + filePath, e);
        }
    }

    /**
     * Extracts the file extension from the original filename.
     * Falls back to ".jpg" if no extension is found.
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
