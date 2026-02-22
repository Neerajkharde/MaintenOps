package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.security.JwtPrincipal;
import java.util.List;

public interface QuotationService {
    QuotationResponseDTO createQuotation(QuotationRequestDTO dto);
    QuotationResponseDTO getQuotation(Long requestId);
    List<InventoryCheckDTO> checkInventory(Long requestId);
    void processApprovedQuotation(Long requestId);
    void generateVendorPurchaseList(Long requestId);
}
