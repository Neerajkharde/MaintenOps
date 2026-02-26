package com.maintenops.nvcc.enums;

public enum RequestStatus {
    // Phase 1: Request & Quotation
    REQUEST_CREATED,        // Step 1: Requester created the request
    QUOTATION_ADDED,        // Step 2: Admin added quotation + required date
    QUOTATION_APPROVED,     // Step 3: Super Admin approved the quotation
    APPROVED,               // Step 4: Requester accepted the quotation

    // Phase 2: List Preparation
    PENDING_SA_APPROVAL,    // Step 5: Admin generated lists, awaiting SA approval
    VENDOR_LIST_APPROVED,   // Step 6: Super Admin approved vendor lists

    // Phase 3: Procurement
    ITEMS_READY,            // Step 7: All materials marked PROCURED

    // Phase 4: Production
    IN_PRODUCTION,          // Step 8: Admin started production
    PAYMENT_PENDING,        // Step 9: Production complete, awaiting payment

    // Phase 5: Closure
    COMPLETED               // Step 11: Admin confirmed payment, request closed
}
