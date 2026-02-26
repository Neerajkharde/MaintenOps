package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.AdminReviewRequestDto;
import com.maintenops.nvcc.dtos.RequestRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.dtos.SuperAdminReviewRequestDto;
import com.maintenops.nvcc.security.JwtPrincipal;

import java.util.List;

public interface RequestService {
    // Requester Operations
    RequestResponseDto createRequest(RequestRequestDto request, JwtPrincipal principal);
    List<RequestResponseDto> getRequestsByUserId(JwtPrincipal principal);
    RequestResponseDto getRequestById(Long id, JwtPrincipal principal);

    // Admin Operations
    RequestResponseDto reviewRequestAsAdmin(AdminReviewRequestDto dto, JwtPrincipal adminPrincipal);
    List<RequestResponseDto> getRequestsForAdminReview();

    // Super Admin Operations
    RequestResponseDto reviewRequestAsSuperAdmin(SuperAdminReviewRequestDto dto, JwtPrincipal superAdminPrincipal);
    List<RequestResponseDto> getRequestsForSuperAdminReview();

    // History Operations
    List<RequestResponseDto> getAdminRequestHistory(JwtPrincipal principal);
    List<RequestResponseDto> getSuperAdminRequestHistory(JwtPrincipal principal);

    // Phase 1: Quotation Flow
    RequestResponseDto userApproveQuotation(Long requestId, JwtPrincipal principal);
    RequestResponseDto getRequestByIdForAdmin(Long requestId);

    // Phase 2: List Preparation
    RequestResponseDto generateLists(Long requestId, JwtPrincipal principal);
    List<RequestResponseDto> getApprovedRequests();
    RequestResponseDto approveVendorLists(Long requestId, JwtPrincipal principal);
    List<RequestResponseDto> getRequestsPendingListApproval();

    // Phase 3: Procurement
    RequestResponseDto markItemProcured(Long requestMaterialId, JwtPrincipal principal);

    // Phase 4: Production
    RequestResponseDto startProduction(Long requestId, JwtPrincipal principal);
    RequestResponseDto completeProduction(Long requestId, JwtPrincipal principal);

    // Phase 5: Payment & Closure
    RequestResponseDto confirmPayment(Long requestId, JwtPrincipal principal);
}
