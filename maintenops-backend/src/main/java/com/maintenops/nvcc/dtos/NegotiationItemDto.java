package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class NegotiationItemDto {
    private Long materialId; // RequestMaterial ID
    private BigDecimal quantity;
    private String reason;
}
