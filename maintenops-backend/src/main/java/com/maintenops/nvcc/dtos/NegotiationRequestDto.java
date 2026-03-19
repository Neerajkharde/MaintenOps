package com.maintenops.nvcc.dtos;

import lombok.Data;
import java.util.List;

@Data
public class NegotiationRequestDto {
    private String overallNote;
    private List<NegotiationItemDto> items;
}
