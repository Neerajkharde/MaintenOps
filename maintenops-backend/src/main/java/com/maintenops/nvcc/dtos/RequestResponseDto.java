package com.maintenops.nvcc.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class RequestResponseDto {
    private Long id;
    private String requestNumber; // e.g., REQ-2026-12345
    private String mobileNumber;

    private String itemDescription;
    private Instant requiredDate;
    private String status; // SUBMITTED, PENDING_SUPER_ADMIN, APPROVED, etc.

    private boolean urgencyRequested;
    private String urgencyReason;

    private String requesterName;
    private String organizationDepartmentName;
    private String serviceDepartmentName;

    // Admin Review Fields
    private String adminRemarks;
    private String adminName;
    private Instant adminReviewedAt;

    // Super Admin & Quotation Fields
    private Double quotationAmount;
    private String quotationDescription;
    private BigDecimal totalEstimatedCost; // Auto-calculated from material picker
    private Integer estimatedDays;
    private String superAdminRemarks;
    private String superAdminName;
    private Instant superAdminReviewedAt;

    private String negotiationNote;

    // Material Line Items (populated when quotation is created)
    private List<MaterialLineItemDTO> materials;

    private Instant createdAt;
}
