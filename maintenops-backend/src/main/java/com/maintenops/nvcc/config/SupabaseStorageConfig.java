package com.maintenops.nvcc.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import lombok.Getter;
import lombok.Setter;

/**
 * Configuration for Supabase Storage integration.
 *
 * Reads from application YAML under the "supabase" prefix:
 *   supabase.url           → SUPABASE_URL env var
 *   supabase.service-key   → SUPABASE_SERVICE_ROLE_KEY env var
 *   supabase.bucket        → SUPABASE_BUCKET env var
 *
 * Exposes a pre-configured RestClient bean ("supabaseRestClient") that
 * includes the base URL and Authorization header for all Storage API calls.
 */
@Configuration
@ConfigurationProperties(prefix = "supabase")
@Getter
@Setter
public class SupabaseStorageConfig {

    /**
     * Supabase project URL, e.g. https://xxxx.supabase.co
     */
    private String url;

    /**
     * Supabase service-role key (full-access, bypasses RLS).
     * Must NEVER be exposed to the client.
     */
    private String serviceKey;

    /**
     * Storage bucket name, e.g. "request-images".
     */
    private String bucket;

    /**
     * Signed URL expiry in seconds. Defaults to 900 (15 minutes).
     */
    private int signedUrlExpirySeconds = 900;

    /**
     * Creates a RestClient pre-configured with the Supabase Storage base URL
     * and the service-role Authorization header.
     *
     * All Storage REST endpoints live under /storage/v1/ so we set that as the base.
     */
    @Bean("supabaseRestClient")
    public RestClient supabaseRestClient() {
        return RestClient.builder()
                .baseUrl(url + "/storage/v1")
                .defaultHeader("apikey", serviceKey)
                .defaultHeader("Authorization", "Bearer " + serviceKey)
                .build();
    }
}
