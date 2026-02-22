package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.RequestRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.entities.Request;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.RequestService;
import com.maintenops.nvcc.services.impls.RequestServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RequestController handles all maintenance request operations.
 * Users can create requests, view their own requests, and manage the request lifecycle.
 *
 * Endpoints:
 * - POST /api/request - Create a new maintenance request
 * - GET /api/request/my - Get all requests created by the logged-in user
 * - GET /api/request/{id} - Get details of a specific request
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/request")
public class RequestController {
    private final RequestService requestService;

    /**
     * Creates a new maintenance request.
     *
     * Request Body Example:
     * {
     *   "mobileNumber": "9876543210",
     *   "itemDescription": "Fix the broken air conditioner in Conference Room A",
     *   "serviceDepartmentName": "Electrical",
     *   "urgencyRequested": true,
     *   "urgencyReason": "Conference room is unusable",
     *   "requiredDate": null
     * }
     *
     * Notes:
     * - requester and organizationDepartmentName are auto-populated from logged-in user
     * - requiredDate is optional and can be set by Admin later
     * - organizationDepartmentName can be optionally provided, otherwise uses user's organization
     *
     * @param request the request details (mobileNumber, itemDescription, serviceDepartmentName are required)
     * @param principal the authenticated user making the request
     * @return ResponseEntity with the created request details and HTTP 201 (CREATED) status
     */
    @PostMapping
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> createRequest(
            @Valid
            @RequestBody RequestRequestDto request,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto savedRequest = requestService.createRequest(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    /**
     * Retrieves all maintenance requests created by the logged-in user.
     *
     * @param principal the authenticated user
     * @return ResponseEntity with list of user's requests and HTTP 200 (OK) status
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<List<RequestResponseDto>> getMyRequests(
            @AuthenticationPrincipal JwtPrincipal principal) {

        List<RequestResponseDto> requests =
                requestService.getRequestsByUserId(principal);

        return ResponseEntity.ok(requests);
    }

    /**
     * Retrieves details of a specific maintenance request by ID.
     *
     * @param id the request ID
     * @param principal the authenticated user
     * @return ResponseEntity with request details and HTTP 200 (OK) status
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> getRequestById(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto request = requestService.getRequestById(id, principal);
        return ResponseEntity.ok(request);
    }

    /**
     * User approves the quotation sent by Super Admin.
     * Triggers inventory check and stock deduction.
     * Status: QUOTATION_SENT → APPROVED
     */
    @PostMapping("/{id}/approve-quotation")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> approveQuotation(
            @PathVariable Long id,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto updated = requestService.userApproveQuotation(id, principal);
        return ResponseEntity.ok(updated);
    }

    /**
     * Admin/Super Admin triggers vendor list generation after user approval.
     * Status: APPROVED → VENDOR_LIST_PREPARED
     */
    @PostMapping("/{id}/generate-vendor-list")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> generateVendorList(@PathVariable Long id) {
        RequestResponseDto updated = requestService.generateVendorList(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get a specific request by ID (for admin viewing)
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> getRequestByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestByIdForAdmin(id));
    }
}
