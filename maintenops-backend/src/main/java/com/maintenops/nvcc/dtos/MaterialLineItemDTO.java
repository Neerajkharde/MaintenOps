package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;

/**
 * A single material line item in a quotation response
 */
@Data
public class MaterialLineItemDTO {
    private Long id;
    private Long materialId;
    private Long specificationId;
    private Long vendorId;
    private String materialName;
    private String specification;
    private BigDecimal quantity;
    private BigDecimal negotiationQuantity;
    private String negotiationReason;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String vendorName;
    private BigDecimal lastPurchaseRate;
    private String status; // PENDING_PURCHASE, FROM_STOCK, PURCHASED, FULFILLED
}
