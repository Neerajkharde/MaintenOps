package com.maintenops.nvcc.dtos;

import lombok.Data;

@Data
public class SpecificationRequestDTO {
    private Long id; // Optional, for updates
    private String specification;
    private String description;
}
