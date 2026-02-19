package com.maintenops.nvcc.dtos;

import lombok.Data;

import java.time.Instant;

@Data
public class RequestResponseDto {
    private Long id;
    private String requestNumber; // e.g., REQ-2026-12345

    private String itemDescription;
    private Instant requiredDate;
    private String status; // SUBMITTED, PENDING, COMPLETED, etc.

    private boolean urgencyRequested;
    private String urgencyReason;

    private String requesterName;
    private String organizationDepartmentName;
    private String serviceDepartmentName;


    private Instant createdAt;
}
