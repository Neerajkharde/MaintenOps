package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.entities.*;
import com.maintenops.nvcc.enums.RequestStatus;
import com.maintenops.nvcc.exceptions.ResourceNotFoundException;
import com.maintenops.nvcc.repositories.*;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.QuotationService;
import com.maintenops.nvcc.entities.VendorPurchaseList;
import com.maintenops.nvcc.services.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final ServiceDepartmentRepository serviceDeptRepository;
    private final RequestMaterialRepository requestMaterialRepo;
    private final QuotationService quotationService;
    private final VendorPurchaseListRepository vendorPurchaseListRepo;

    private RequestResponseDto mapToResponse(Request request) {

        RequestResponseDto response = new RequestResponseDto();

        response.setId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
        response.setMobileNumber(request.getMobileNumber());
        response.setItemDescription(request.getItemDescription());
        response.setRequiredDate(request.getRequiredDate());
        response.setUrgencyRequested(request.isUrgencyRequested());
        response.setUrgencyReason(request.getUrgencyReason());
        response.setStatus(request.getStatus().name());
        response.setCreatedAt(request.getCreatedAt());

        response.setRequesterName(request.getRequester().getUsername());
        response.setOrganizationDepartmentName(request.getOrganizationDepartment().getName());
        response.setServiceDepartmentName(request.getServiceDepartment().getName());

        // Admin Review Fields
        if (request.getReviewedByAdmin() != null) {
            response.setAdminName(request.getReviewedByAdmin().getUsername());
            response.setAdminRemarks(request.getAdminRemarks());
            response.setAdminReviewedAt(request.getAdminReviewedAt());
        }

        // Super Admin Review Fields
        if (request.getReviewedBySuperAdmin() != null) {
            response.setSuperAdminName(request.getReviewedBySuperAdmin().getUsername());
            response.setSuperAdminRemarks(request.getSuperAdminRemarks());
            response.setQuotationAmount(request.getQuotationAmount());
            response.setQuotationDescription(request.getQuotationDescription());
            response.setSuperAdminReviewedAt(request.getSuperAdminReviewedAt());
        }

        // Negotiation Field
        response.setNegotiationNote(request.getNegotiationNote());

        // New quotation fields (from material picker)
        response.setTotalEstimatedCost(request.getTotalEstimatedCost());
        response.setEstimatedDays(request.getEstimatedDays());

        // Attach material line items if quotation has been created
        if (request.getTotalEstimatedCost() != null) {
            List<RequestMaterial> materials = requestMaterialRepo.findByRequestId(request.getId());
            if (!materials.isEmpty()) {
                response.setMaterials(materials.stream().map(rm -> {
                    MaterialLineItemDTO dto = new MaterialLineItemDTO();
                    dto.setId(rm.getId());
                    dto.setMaterialId(rm.getMaterial() != null ? rm.getMaterial().getId() : null);
                    dto.setSpecificationId(rm.getSpecification() != null ? rm.getSpecification().getId() : null);
                    dto.setVendorId(rm.getVendor() != null ? rm.getVendor().getId() : null);
                    dto.setMaterialName(rm.getMaterialName());
                    dto.setSpecification(rm.getSpecificationText());
                    dto.setQuantity(rm.getQuantityRequired());
                    dto.setUnit(rm.getUnit());
                    dto.setUnitPrice(rm.getUnitPrice());
                    dto.setTotalPrice(rm.getTotalPrice());
                    dto.setVendorName(rm.getVendorName());
                    dto.setLastPurchaseRate(rm.getLastPurchaseRate());
                    dto.setNegotiationQuantity(rm.getNegotiationQuantity());
                    dto.setNegotiationReason(rm.getNegotiationReason());
                    dto.setStatus(rm.getStatus());
                    return dto;
                }).collect(Collectors.toList()));
            }
        }

        return response;
    }

    // ==================== Phase 1: Request & Quotation ====================

    public RequestResponseDto createRequest(RequestRequestDto dto, JwtPrincipal principal) {

        Request request = new Request();

        request.setItemDescription(dto.getItemDescription());
        request.setRequiredDate(dto.getRequiredDate());
        request.setUrgencyRequested(dto.isUrgencyRequested());
        request.setUrgencyReason(dto.getUrgencyReason());
        request.setMobileNumber(dto.getMobileNumber());

        // Fetch the Requester
        Long userId = principal.getUserId();
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setRequester(requester);

        // Auto-populate Organization Department from logged-in user
        OrganizationDepartment orgDept = requester.getOrganizationDepartment();
        if (orgDept == null) {
            throw new ResourceNotFoundException("User's organization department not found. Please contact admin.");
        }
        request.setOrganizationDepartment(orgDept);

        // Resolve Service Department by Name (from DTO)
        ServiceDepartment serviceDept = serviceDeptRepository.findByName(dto.getServiceDepartmentName())
                .orElseThrow(() -> new ResourceNotFoundException("Service Dept not found: " + dto.getServiceDepartmentName()));
        request.setServiceDepartment(serviceDept);

        // Generate unique Request Number
        request.setRequestNumber(generateRequestNumber());
        request.setStatus(RequestStatus.REQUEST_CREATED);

        Request savedRequest = requestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    @Override
    public List<RequestResponseDto> getRequestsByUserId(JwtPrincipal principal) {
        Long userId = principal.getUserId();
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Request> requests = requestRepository.findByRequesterId(userId);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto getRequestById(Long id, JwtPrincipal principal) {
        Long userId = principal.getUserId();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        if (!request.getRequester().getId().equals(userId)) {
            throw new ResourceNotFoundException("You do not have access to this request");
        }
        return mapToResponse(request);
    }

    @Override
    public RequestResponseDto reviewRequestAsAdmin(AdminReviewRequestDto dto, JwtPrincipal adminPrincipal) {
        Long adminId = adminPrincipal.getUserId();
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + dto.getRequestId()));

        // Verify request is in REQUEST_CREATED status (waiting for admin review)
        if (!request.getStatus().equals(RequestStatus.REQUEST_CREATED)) {
            throw new RuntimeException("Request is not in REQUEST_CREATED status. Current status: " + request.getStatus());
        }

        // Set admin review details
        request.setAdminRemarks(dto.getAdminRemarks());
        request.setReviewedByAdmin(admin);
        request.setAdminReviewedAt(Instant.now());
        request.setRequiredDate(dto.getRequiredDate());

        // Update status based on approval
        if (dto.isApproved()) {
            request.setStatus(RequestStatus.QUOTATION_ADDED); // Move to Super Admin review
        } else {
            request.setStatus(RequestStatus.REQUEST_CREATED); // Keep for requester to revise
        }

        Request updatedRequest = requestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    @Override
    public List<RequestResponseDto> getRequestsForAdminReview() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.REQUEST_CREATED);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto reviewRequestAsSuperAdmin(SuperAdminReviewRequestDto dto, JwtPrincipal superAdminPrincipal) {
        Long superAdminId = superAdminPrincipal.getUserId();
        User superAdmin = userRepository.findById(superAdminId)
                .orElseThrow(() -> new ResourceNotFoundException("Super Admin not found"));

        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + dto.getRequestId()));

        // Verify request is in QUOTATION_ADDED status
        if (!request.getStatus().equals(RequestStatus.QUOTATION_ADDED)) {
            throw new RuntimeException("Request is not in QUOTATION_ADDED status. Current status: " + request.getStatus());
        }

        // Set super admin review details
        request.setQuotationAmount(dto.getQuotationAmount());
        request.setQuotationDescription(dto.getQuotationDescription());
        request.setSuperAdminRemarks(dto.getSuperAdminRemarks());
        request.setReviewedBySuperAdmin(superAdmin);
        request.setSuperAdminReviewedAt(Instant.now());

        // Update status based on approval
        if (dto.isApproved()) {
            request.setStatus(RequestStatus.QUOTATION_APPROVED); // Quotation sent to requester for approval
        } else {
            request.setStatus(RequestStatus.QUOTATION_ADDED); // Keep for SA to revise
        }

        Request updatedRequest = requestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    @Override
    public List<RequestResponseDto> getRequestsForSuperAdminReview() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.QUOTATION_ADDED);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RequestResponseDto> getAdminRequestHistory(JwtPrincipal principal) {
        // Return all requests that have moved past REQUEST_CREATED status
        List<Request> requests = requestRepository.findByStatusNot(RequestStatus.REQUEST_CREATED);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RequestResponseDto> getSuperAdminRequestHistory(JwtPrincipal principal) {
        Long superAdminId = principal.getUserId();
        List<Request> requests = requestRepository.findByReviewedBySuperAdminId(superAdminId);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto userApproveQuotation(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        // Verify the logged-in user is the requester
        if (!request.getRequester().getId().equals(principal.getUserId())) {
            throw new ResourceNotFoundException("You do not have access to this request");
        }

        if (!request.getStatus().equals(RequestStatus.QUOTATION_APPROVED)) {
            throw new RuntimeException("Request is not awaiting your approval. Status: " + request.getStatus());
        }

        // Set all material items to PENDING_PROCUREMENT (no inventory deduction per spec)
        List<RequestMaterial> materials = requestMaterialRepo.findByRequestId(requestId);
        for (RequestMaterial rm : materials) {
            rm.setStatus("PENDING_PROCUREMENT");
            requestMaterialRepo.save(rm);
        }

        request.setStatus(RequestStatus.APPROVED);
        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public RequestResponseDto getRequestByIdForAdmin(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));
        return mapToResponse(request);
    }

    // ==================== Phase 2: List Preparation ====================

    @Override
    public List<RequestResponseDto> getApprovedRequests() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.APPROVED);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto generateLists(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!request.getStatus().equals(RequestStatus.APPROVED)) {
            throw new RuntimeException("Request must be APPROVED before generating lists. Status: " + request.getStatus());
        }

        // Generate vendor purchase lists (aggregated by vendor)
        quotationService.generateVendorPurchaseList(requestId);

        request.setStatus(RequestStatus.PENDING_SA_APPROVAL);
        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public List<RequestResponseDto> getRequestsPendingListApproval() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.PENDING_SA_APPROVAL);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto approveVendorLists(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!request.getStatus().equals(RequestStatus.PENDING_SA_APPROVAL)) {
            throw new RuntimeException("Request is not pending list approval. Status: " + request.getStatus());
        }

        request.setStatus(RequestStatus.VENDOR_LIST_APPROVED);
        return mapToResponse(requestRepository.save(request));
    }

    // ==================== Phase 3: Procurement ====================

    @Override
    public RequestResponseDto markItemProcured(Long requestMaterialId, JwtPrincipal principal) {
        RequestMaterial rm = requestMaterialRepo.findById(requestMaterialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material item not found: " + requestMaterialId));

        Request request = rm.getRequest();

        // Can only mark items as procured when status is VENDOR_LIST_APPROVED
        if (!request.getStatus().equals(RequestStatus.VENDOR_LIST_APPROVED)) {
            throw new RuntimeException("Cannot mark items as procured. Request status: " + request.getStatus());
        }

        rm.setStatus("PROCURED");
        requestMaterialRepo.save(rm);

        // Also update the matching VendorPurchaseList entry so Super Admin sees procured status
        if (rm.getVendor() != null && rm.getMaterial() != null) {
            List<VendorPurchaseList> vpls = vendorPurchaseListRepo.findByMaterialIdAndVendorId(
                    rm.getMaterial().getId(), rm.getVendor().getId());
            for (VendorPurchaseList vpl : vpls) {
                if (!Boolean.TRUE.equals(vpl.getIsPurchased())) {
                    vpl.setIsPurchased(true);
                    vpl.setPurchasedAt(java.time.LocalDateTime.now());
                    vendorPurchaseListRepo.save(vpl);
                }
            }
        }

        // Check if ALL items for this request are now PROCURED
        List<RequestMaterial> allMaterials = requestMaterialRepo.findByRequestId(request.getId());
        boolean allProcured = allMaterials.stream()
                .allMatch(m -> "PROCURED".equals(m.getStatus()));

        if (allProcured) {
            request.setStatus(RequestStatus.ITEMS_READY);
            requestRepository.save(request);
        }

        return mapToResponse(request);
    }

    @Override
    public List<RequestResponseDto> getItemsReadyRequests() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.ITEMS_READY);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==================== Phase 4: Production ====================

    @Override
    public RequestResponseDto startProduction(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!request.getStatus().equals(RequestStatus.ITEMS_READY)) {
            throw new RuntimeException("Cannot start production. Request status must be ITEMS_READY. Current: " + request.getStatus());
        }

        request.setStatus(RequestStatus.IN_PRODUCTION);
        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public RequestResponseDto completeProduction(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!request.getStatus().equals(RequestStatus.IN_PRODUCTION)) {
            throw new RuntimeException("Cannot complete production. Request status must be IN_PRODUCTION. Current: " + request.getStatus());
        }

        request.setStatus(RequestStatus.PAYMENT_PENDING);
        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public List<RequestResponseDto> getInProductionRequests() {
        List<Request> requests = requestRepository.findByStatus(RequestStatus.IN_PRODUCTION);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==================== Phase 5: Payment & Closure ====================

    @Override
    public RequestResponseDto confirmPayment(Long requestId, JwtPrincipal principal) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (!request.getStatus().equals(RequestStatus.PAYMENT_PENDING)) {
            throw new RuntimeException("Cannot confirm payment. Request status must be PAYMENT_PENDING. Current: " + request.getStatus());
        }

        request.setStatus(RequestStatus.COMPLETED);
        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public RequestResponseDto negotiateQuotation(Long id, com.maintenops.nvcc.dtos.NegotiationRequestDto dto, JwtPrincipal principal) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + id));

        // Verify the logged-in user is the requester
        if (!request.getRequester().getId().equals(principal.getUserId())) {
            throw new ResourceNotFoundException("You do not have access to this request");
        }

        if (!request.getStatus().equals(RequestStatus.QUOTATION_APPROVED) && !request.getStatus().equals(RequestStatus.NEGOTIATION_PENDING)) {
            throw new RuntimeException("Request is not in a negotiable state. Status: " + request.getStatus());
        }

        request.setNegotiationNote(dto.getOverallNote());
        request.setStatus(RequestStatus.NEGOTIATION_PENDING);

        // Update individual material negotiation details
        List<RequestMaterial> materials = requestMaterialRepo.findByRequestId(id);
        if (dto.getItems() != null) {
            for (com.maintenops.nvcc.dtos.NegotiationItemDto itemDto : dto.getItems()) {
                materials.stream()
                        .filter(rm -> rm.getId().equals(itemDto.getMaterialId()))
                        .findFirst()
                        .ifPresent(rm -> {
                            rm.setNegotiationQuantity(itemDto.getQuantity());
                            rm.setNegotiationReason(itemDto.getReason());
                            requestMaterialRepo.save(rm);
                        });
            }
        }

        return mapToResponse(requestRepository.save(request));
    }

    @Override
    public RequestResponseDto approveNegotiation(Long id, JwtPrincipal adminPrincipal) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + id));

        if (!request.getStatus().equals(RequestStatus.NEGOTIATION_PENDING)) {
            throw new RuntimeException("Request is not in NEGOTIATION_PENDING status. Status: " + request.getStatus());
        }

        // Set status back to QUOTATION_APPROVED (bypassing Super Admin)
        request.setStatus(RequestStatus.QUOTATION_APPROVED);
        
        // Clear negotiation details once adjusted/approved? 
        // Or keep them for history? Let's keep them on items but maybe clear the overall note or just leave it.
        // Actually, let's just update the status.

        return mapToResponse(requestRepository.save(request));
    }

    // ==================== Helpers ====================

    private String generateRequestNumber() {
        long timestamp = System.currentTimeMillis() % 10000;
        return "REQ-" + LocalDate.now().getYear() + "-" + timestamp;
    }
}
