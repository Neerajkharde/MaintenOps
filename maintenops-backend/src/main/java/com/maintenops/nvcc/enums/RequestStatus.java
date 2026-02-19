package com.maintenops.nvcc.enums;

public enum RequestStatus {
    // Week 1 Statuses
    SUBMITTED,              // Created but not reviewed

    // Week 2 Statuses
    PENDING_URGENCY_APPROVAL, // For EMERGENCY/HIGH requests
    QUOTATION_REQUIRED,     // Admin needs to add costs
    PENDING_SA_APPROVAL,    // Waiting for SA to sign off

    // Week 3 Statuses
    IN_PROCUREMENT,         // Buying materials
    IN_PRODUCTION,          // Maintenance/Work is happening
    READY_FOR_COLLECTION,   // Work is done

    // Week 4 Statuses
    COMPLETED,              // Paid and picked up
    ARCHIVED
}
