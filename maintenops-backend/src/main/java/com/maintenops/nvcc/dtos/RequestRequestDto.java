package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class RequestRequestDto {

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "Item description is required")
    private String itemDescription;

// This is set by Admin
    private Instant requiredDate;

    private boolean urgencyRequested;
    private String urgencyReason;

    @NotBlank(message = "Service department is required")
    private String serviceDepartmentName;

    // Organization department will be auto-populated from logged-in user
    private String organizationDepartmentName;

}

