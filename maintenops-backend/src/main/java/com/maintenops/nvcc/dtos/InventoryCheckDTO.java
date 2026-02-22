package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventoryCheckDTO {
    private Long materialId;
    private Long specificationId;
    private String materialName;
    private String specification;
    private BigDecimal requiredQuantity;
    private BigDecimal availableQuantity;
    private BigDecimal shortfall;
    private String status; // SUFFICIENT, INSUFFICIENT, NOT_AVAILABLE
}
