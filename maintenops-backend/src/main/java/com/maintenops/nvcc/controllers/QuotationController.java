package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.entities.VendorPurchaseList;
import com.maintenops.nvcc.repositories.VendorPurchaseListRepository;
import com.maintenops.nvcc.services.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * QuotationController - handles material-based quotation creation and approval
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;
    private final VendorPurchaseListRepository vendorPurchaseListRepo;

    /**
     * Create a structured quotation using the material picker
     * POST /api/quotations/create
     * ADMIN only
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuotationResponseDTO> createQuotation(
            @RequestBody QuotationRequestDTO dto) {
        return ResponseEntity.ok(quotationService.createQuotation(dto));
    }

    /**
     * Get the quotation for a specific request (material breakdown)
     * GET /api/quotations/{requestId}
     */
    @GetMapping("/{requestId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'REQUESTER')")
    public ResponseEntity<QuotationResponseDTO> getQuotation(@PathVariable Long requestId) {
        return ResponseEntity.ok(quotationService.getQuotation(requestId));
    }

    /**
     * Check inventory status for a request's materials
     * GET /api/quotations/{requestId}/inventory-check
     */
    @GetMapping("/{requestId}/inventory-check")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<InventoryCheckDTO>> checkInventory(@PathVariable Long requestId) {
        return ResponseEntity.ok(quotationService.checkInventory(requestId));
    }

    /**
     * Get all vendor purchase lists (aggregated PENDING_PROCUREMENT items by vendor)
     * GET /api/vendor-lists
     */
    @Transactional(readOnly = true)
    @GetMapping("/vendor-lists")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<VendorPurchaseList>> getVendorLists(
            @RequestParam(required = false) Boolean unpurchasedOnly) {

        List<VendorPurchaseList> lists = (Boolean.TRUE.equals(unpurchasedOnly))
                ? vendorPurchaseListRepo.findByIsPurchasedFalse()
                : vendorPurchaseListRepo.findAll();

        return ResponseEntity.ok(lists);
    }

    /**
     * Mark a vendor purchase list item as purchased
     * PUT /api/quotations/vendor-lists/{id}/mark-purchased
     */
    @PutMapping("/vendor-lists/{id}/mark-purchased")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> markPurchased(@PathVariable Long id) {
        VendorPurchaseList vpl = vendorPurchaseListRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor purchase list item not found"));
        vpl.setIsPurchased(true);
        vpl.setPurchasedAt(java.time.LocalDateTime.now());
        vendorPurchaseListRepo.save(vpl);
        return ResponseEntity.ok().build();
    }
}
