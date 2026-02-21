package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
// @Builder
public class DeptDto {
    @NotBlank
    private String name;
}
