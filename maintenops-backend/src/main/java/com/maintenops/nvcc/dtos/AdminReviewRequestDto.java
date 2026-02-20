package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

/**
 * DTO for Admin to review a request
 * Admin examines the request details and sets the required date
 */
@Data
public class AdminReviewRequestDto {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotNull(message = "Required date is required")
    private Instant requiredDate; // Admin sets when the work should be completed

    @NotBlank(message = "Admin remarks are required")
    private String adminRemarks; // Admin's examination notes and comments

    // Optional: Admin can approve or ask for changes
    private boolean approved; // true = move to Super Admin, false = ask requester for changes
}

