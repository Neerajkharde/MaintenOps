package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.dtos.SuperAdminReviewRequestDto;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SuperAdminController handles super admin-specific operations.
 * Super Admin has approval authority before financial commitment stages.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/super-admin")
public class SuperAdminController {
    private final RequestService requestService;

    // ==================== Phase 1: Quotation Approval ====================

    /**
     * Get all requests waiting for super admin quotation review (QUOTATION_ADDED status)
     */
    @GetMapping("/requests/pending-review")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getRequestsForReview(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getRequestsForSuperAdminReview());
    }

    /**
     * Review (approve/reject) a quotation as Super Admin.
     * Status: QUOTATION_ADDED → QUOTATION_APPROVED
     */
    @PutMapping("/requests/review")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> reviewRequest(
            @Valid @RequestBody SuperAdminReviewRequestDto dto,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.reviewRequestAsSuperAdmin(dto, principal));
    }

    /**
     * Get review history for the logged-in Super Admin
     */
    @GetMapping("/requests/history")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getSuperAdminHistory(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getSuperAdminRequestHistory(principal));
    }

    // ==================== Phase 2: Vendor List Approval ====================

    /**
     * Get all requests pending vendor list approval (PENDING_SA_APPROVAL status)
     */
    @GetMapping("/requests/pending-list-approval")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getRequestsPendingListApproval(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getRequestsPendingListApproval());
    }

    /**
     * Approve vendor lists for a request.
     * Status: PENDING_SA_APPROVAL → VENDOR_LIST_APPROVED
     * Procurement cannot begin before this approval.
     */
    @PostMapping("/requests/{id}/approve-vendor-lists")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> approveVendorLists(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.approveVendorLists(id, principal));
    }
}
