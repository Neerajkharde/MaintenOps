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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * RequestController handles all maintenance request operations.
 * Users can create requests, view their own requests, and manage the request lifecycle.
 *
 * Endpoints:
 * - POST /api/request - Create a new maintenance request (multipart/form-data)
 * - GET /api/request/my - Get all requests created by the logged-in user
 * - GET /api/request/{id} - Get details of a specific request
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/request")
public class RequestController {
    private final RequestService requestService;

    /**
     * Creates a new maintenance request with optional image uploads.
     *
     * This endpoint accepts multipart/form-data with:
     * - "request" part: JSON with mobileNumber, itemDescription, serviceDepartmentName, etc.
     * - "images" part (optional): Up to 4 image files (JPG/PNG, max 5MB each)
     *
     * Notes:
     * - requester and organizationDepartmentName are auto-populated from logged-in user
     * - requiredDate is optional and can be set by Admin later
     *
     * @param request the request details
     * @param images optional image files
     * @param principal the authenticated user making the request
     * @return ResponseEntity with the created request details and HTTP 201 (CREATED) status
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> createRequest(
            @Valid
            @RequestPart("request") RequestRequestDto request,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto savedRequest = requestService.createRequest(request, principal, images);
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
     * User accepts the quotation approved by Super Admin.
     * Status: QUOTATION_APPROVED → APPROVED
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
     * User requests negotiation for the quotation.
     * Status: QUOTATION_APPROVED -> NEGOTIATION_PENDING
     */
    @PostMapping("/{id}/negotiate")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> negotiateQuotation(
            @PathVariable Long id,
            @RequestBody com.maintenops.nvcc.dtos.NegotiationRequestDto dto,
            @AuthenticationPrincipal JwtPrincipal principal) {

        RequestResponseDto updated = requestService.negotiateQuotation(id, dto, principal);
        return ResponseEntity.ok(updated);
    }

    // generateVendorList endpoint moved to AdminController as /api/admin/requests/{id}/generate-lists

    /**
     * Get a specific request by ID (for admin viewing)
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<RequestResponseDto> getRequestByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestByIdForAdmin(id));
    }
}
