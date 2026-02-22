package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO after quotation is created or retrieved
 */
@Data
public class QuotationResponseDTO {
    private Long requestId;
    private String requestNumber;
    private BigDecimal totalCost;
    private String quotationDescription; // Auto-generated
    private List<MaterialLineItemDTO> materials;
    private Integer estimatedDays;
    private String status;
}
