package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;

/**
 * Single material line item in a quotation request
 */
@Data
public class MaterialItemDTO {
    private Long materialId;
    private Long specificationId; // nullable (some materials have no specs)
    private BigDecimal quantity;
    private Long vendorId;
    private BigDecimal unitPrice; // Admin-entered price (can override last purchase rate)
}
