package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO for Super Admin to review a request and provide quotation
 * Super Admin examines the admin's review and sends the quotation
 */
@Data
public class SuperAdminReviewRequestDto {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotNull(message = "Quotation amount is required")
    @Positive(message = "Quotation amount must be greater than 0")
    private Double quotationAmount; // Cost estimate for the maintenance work

    @NotBlank(message = "Quotation description is required")
    private String quotationDescription; // Detailed breakdown of the quotation

    @NotBlank(message = "Super Admin remarks are required")
    private String superAdminRemarks; // Super Admin's approval/comments

    // Optional: Super Admin can approve or reject
    private boolean approved; // true = approve and start work, false = reject with remarks
}

