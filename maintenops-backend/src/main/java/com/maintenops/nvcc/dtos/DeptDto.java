package com.maintenops.nvcc.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeptDto {
    @NotBlank
    private String name;
}
