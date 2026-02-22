package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for Super Admin to review a request and provide quotation
 * Super Admin examines the admin's review and sends the quotation
 */
@Data
public class SuperAdminReviewRequestDto {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    // Auto-populated from material picker — no validation needed
    private Double quotationAmount;

    private String quotationDescription;

    @NotBlank(message = "Super Admin remarks are required")
    private String superAdminRemarks; // Super Admin's approval/comments

    // Optional: Super Admin can approve or reject
    private boolean approved; // true = approve and start work, false = reject with remarks
}

