package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for Admin to create a structured quotation using the material picker
 */
@Data
public class QuotationRequestDTO {
    private Long requestId;
    private List<MaterialItemDTO> materials;
    private Integer estimatedDays;
    private String quotationNotes; // Internal admin notes
}
