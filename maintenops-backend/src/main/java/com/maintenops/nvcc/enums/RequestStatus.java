package com.maintenops.nvcc.enums;

public enum RequestStatus {
    // Week 1 Statuses
    SUBMITTED,              // Created but not reviewed
    PENDING_SA_APPROVAL,    // Waiting for SA to sign off (Admin created quotation)
    APPROVED,               // User approved the quotation

    // Week 2+ Statuses
    QUOTATION_SENT,         // SA approved, quotation sent to user for approval
    VENDOR_LIST_PREPARED,   // Inventory checked, vendor purchase lists generated
}
