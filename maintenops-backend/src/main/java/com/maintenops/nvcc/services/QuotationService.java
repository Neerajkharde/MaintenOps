package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.*;
import java.util.List;

public interface QuotationService {
    QuotationResponseDTO createQuotation(QuotationRequestDTO dto);
    QuotationResponseDTO getQuotation(Long requestId);
    List<InventoryCheckDTO> checkInventory(Long requestId);
    void generateVendorPurchaseList(Long requestId);
}
