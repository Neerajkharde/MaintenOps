package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;

/**
 * A single material line item in a quotation response
 */
@Data
public class MaterialLineItemDTO {
    private Long id;
    private String materialName;
    private String specification;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String vendorName;
    private BigDecimal lastPurchaseRate;
    private String status; // PENDING_PURCHASE, FROM_STOCK, PURCHASED, FULFILLED
}
