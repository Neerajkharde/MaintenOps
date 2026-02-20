package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.dtos.SuperAdminReviewRequestDto;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SuperAdminController handles super admin-specific operations
 * Super Admin can send quotations, approve requests, and manage work allocation
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/super-admin")
public class SuperAdminController {
    private final RequestService requestService;

    /**
     * Get all requests waiting for super admin review
     * Returns all PENDING_SA_APPROVAL requests that need super admin examination and quotation
     *
     * @param principal the authenticated super admin user
     * @return ResponseEntity with list of requests pending super admin review and HTTP 200 (OK) status
     */
    @GetMapping("/requests/pending-review")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getRequestsForReview(
            @AuthenticationPrincipal JwtPrincipal principal) {

        List<RequestResponseDto> requests = requestService.getRequestsForSuperAdminReview();
        return ResponseEntity.ok(requests);
    }

    /**
     * Review a request as Super Admin and send quotation
     * Super Admin examines admin's review, provides cost estimate and quotation details
     *
     * Request Body Example:
     * {
     *   "requestId": 1,
     *   "quotationAmount": 5000.00,
     *   "quotationDescription": "Parts: AC compressor (₹3500), Labor (₹1500)",
     *   "superAdminRemarks": "Approved for procurement. Standard maintenance.",
     *   "approved": true
     * }
     *
     * Notes:
     * - approved=true: Moves request to APPROVED status, ready to start work
     * - approved=false: Keeps request as PENDING_SA_APPROVAL for super admin to revise quotation
     * - quotationAmount: Total estimated cost for the maintenance work
     * - quotationDescription: Itemized breakdown of costs
     *
     * @param dto the super admin review details (requestId, quotationAmount, quotationDescription, superAdminRemarks, approved)
     * @param principal the authenticated super admin user
     * @return ResponseEntity with updated request details and HTTP 200 (OK) status
     */
    @PutMapping("/requests/review")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> reviewRequest(
            @Valid
            @RequestBody SuperAdminReviewRequestDto dto,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto updatedRequest = requestService.reviewRequestAsSuperAdmin(dto, principal);
        return ResponseEntity.ok(updatedRequest);
    }
}

