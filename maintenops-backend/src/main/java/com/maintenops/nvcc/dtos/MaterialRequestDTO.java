package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.util.List;

@Data
public class MaterialRequestDTO {
    private String name;
    private String category;
    private String defaultUnit;
    private List<SpecificationRequestDTO> specifications;
}
