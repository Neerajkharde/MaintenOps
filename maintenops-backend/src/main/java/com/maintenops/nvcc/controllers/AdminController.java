package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.AdminReviewRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
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
 * AdminController handles admin-specific operations across all phases.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final RequestService requestService;

    // ==================== Phase 1: Request Review ====================

    /**
     * Get all requests waiting for admin review (REQUEST_CREATED status)
     */
    @GetMapping("/requests/pending-review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getRequestsForReview(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getRequestsForAdminReview());
    }

    /**
     * Review a request as Admin — adds quotation details and required date.
     * Status: REQUEST_CREATED → QUOTATION_ADDED
     */
    @PutMapping("/requests/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> reviewRequest(
            @Valid @RequestBody AdminReviewRequestDto dto,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.reviewRequestAsAdmin(dto, principal));
    }

    /**
     * Get review history for the logged-in Admin
     */
    @GetMapping("/requests/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getAdminHistory(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getAdminRequestHistory(principal));
    }

    // ==================== Phase 2: List Preparation ====================

    /**
     * Get all APPROVED requests (ready for list generation)
     */
    @GetMapping("/requests/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getApprovedRequests(
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.getApprovedRequests());
    }

    /**
     * Generate User Material List + Vendor Lists for a request.
     * Status: APPROVED → PENDING_SA_APPROVAL
     */
    @PostMapping("/requests/{id}/generate-lists")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> generateLists(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.generateLists(id, principal));
    }

    // ==================== Phase 3: Procurement ====================

    /**
     * Mark a single material item as PROCURED.
     * When all items are procured, request auto-transitions to ITEMS_READY.
     */
    @PutMapping("/requests/materials/{materialId}/mark-procured")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> markItemProcured(
            @PathVariable Long materialId,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.markItemProcured(materialId, principal));
    }

    // ==================== Phase 4: Production ====================

    /**
     * Start production for a request.
     * Status: ITEMS_READY → IN_PRODUCTION
     */
    @PostMapping("/requests/{id}/start-production")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> startProduction(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.startProduction(id, principal));
    }

    /**
     * Complete production for a request.
     * Status: IN_PRODUCTION → PAYMENT_PENDING
     */
    @PostMapping("/requests/{id}/complete-production")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> completeProduction(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.completeProduction(id, principal));
    }

    // ==================== Phase 5: Payment & Closure ====================

    /**
     * Confirm payment received, close the request.
     * Status: PAYMENT_PENDING → COMPLETED
     */
    @PostMapping("/requests/{id}/confirm-payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> confirmPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(requestService.confirmPayment(id, principal));
    }
}
