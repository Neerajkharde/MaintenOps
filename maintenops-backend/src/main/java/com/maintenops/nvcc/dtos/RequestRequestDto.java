package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class RequestRequestDto {
    @NotBlank(message = "Item description is required")
    private String itemDescription;

    @NotNull(message = "Required date is required")
    private Instant requiredDate;

    private boolean urgencyRequested;
    private String urgencyReason;

    @NotBlank(message = "Service department is required")
    private String serviceDepartmentName;

    @NotBlank(message = "Organization department is required")
    private String organizationDepartmentName;

}
