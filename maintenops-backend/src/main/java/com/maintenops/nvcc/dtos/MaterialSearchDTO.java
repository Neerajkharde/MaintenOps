package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * Material search result with full specs and vendor list
 */
@Data
public class MaterialSearchDTO {
    private Long materialId;
    private String materialName;
    private String category;
    private String defaultUnit;
    private List<SpecificationDTO> specifications;
    private List<VendorDTO> vendors;
    private BigDecimal lastPurchaseRate; // Most recent rate for default spec
}
