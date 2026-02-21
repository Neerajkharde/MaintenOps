package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.AdminReviewRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
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
 * AdminController handles admin-specific operations
 * Admin can review requests, set required dates, and examine request details
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final RequestService requestService;

    /**
     * Get all requests waiting for admin review
     * Returns all SUBMITTED requests that need admin examination
     *
     * @param principal the authenticated admin user
     * @return ResponseEntity with list of requests pending admin review and HTTP 200 (OK) status
     */
    @GetMapping("/requests/pending-review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getRequestsForReview(
            @AuthenticationPrincipal JwtPrincipal principal) {

        List<RequestResponseDto> requests = requestService.getRequestsForAdminReview();
        return ResponseEntity.ok(requests);
    }

    /**
     * Review a request as Admin
     * Admin examines the request and sets the required date for completion
     *
     * Request Body Example:
     * {
     *   "requestId": 1,
     *   "requiredDate": "2026-03-15T18:00:00Z",
     *   "adminRemarks": "Feasible to complete. Electrical team available.",
     *   "approved": true
     * }
     *
     * Notes:
     * - approved=true: Moves request to PENDING_SA_APPROVAL (Super Admin review)
     * - approved=false: Keeps request as SUBMITTED for requester to provide more details
     *
     * @param dto the admin review details (requestId, requiredDate, adminRemarks, approved)
     * @param principal the authenticated admin user
     * @return ResponseEntity with updated request details and HTTP 200 (OK) status
     */
    @PutMapping("/requests/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestResponseDto> reviewRequest(
            @Valid
            @RequestBody AdminReviewRequestDto dto,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto updatedRequest = requestService.reviewRequestAsAdmin(dto, principal);
        return ResponseEntity.ok(updatedRequest);
    }

    /**
     * Get review history for the logged-in Admin
     * Returns requests that the admin has already reviewed
     *
     * @param principal the authenticated admin user
     * @return ResponseEntity with list of requests and HTTP 200 (OK) status
     */
    @GetMapping("/requests/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestResponseDto>> getAdminHistory(
            @AuthenticationPrincipal JwtPrincipal principal) {

        List<RequestResponseDto> requests = requestService.getAdminRequestHistory(principal);
        return ResponseEntity.ok(requests);
    }
}

