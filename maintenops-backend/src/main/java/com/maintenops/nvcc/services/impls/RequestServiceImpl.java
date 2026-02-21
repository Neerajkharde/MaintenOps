package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.AdminReviewRequestDto;
import com.maintenops.nvcc.dtos.RequestRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.dtos.SuperAdminReviewRequestDto;
import com.maintenops.nvcc.entities.OrganizationDepartment;
import com.maintenops.nvcc.entities.Request;
import com.maintenops.nvcc.entities.ServiceDepartment;
import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.enums.RequestStatus;
import com.maintenops.nvcc.exceptions.ResourceNotFoundException;
import com.maintenops.nvcc.repositories.RequestRepository;
import com.maintenops.nvcc.repositories.ServiceDepartmentRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final ServiceDepartmentRepository serviceDeptRepository;

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

        response.setRequesterName(
                request.getRequester().getUsername()
        );

        response.setOrganizationDepartmentName(
                request.getOrganizationDepartment().getName()
        );

        response.setServiceDepartmentName(
                request.getServiceDepartment().getName()
        );

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

        return response;
    }

    public RequestResponseDto createRequest(RequestRequestDto dto, JwtPrincipal principal) {

        Request request = new Request();

        request.setItemDescription(dto.getItemDescription());
        request.setRequiredDate(dto.getRequiredDate());
        request.setUrgencyRequested(dto.isUrgencyRequested());
        request.setUrgencyReason(dto.getUrgencyReason());
        request.setMobileNumber(dto.getMobileNumber());

        // 2. Fetch the Requester
        Long userId = principal.getUserId();
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setRequester(requester);

        // 3. Auto-populate Organization Department from logged-in user
        OrganizationDepartment orgDept = requester.getOrganizationDepartment();
        if (orgDept == null) {
            throw new ResourceNotFoundException("User's organization department not found. Please contact admin.");
        }
        request.setOrganizationDepartment(orgDept);

        // 4. Resolve Service Department by Name (from DTO)
        ServiceDepartment serviceDept = serviceDeptRepository.findByName(dto.getServiceDepartmentName())
                .orElseThrow(() -> new ResourceNotFoundException("Service Dept not found: " + dto.getServiceDepartmentName()));
        request.setServiceDepartment(serviceDept);

        // 5. Generate unique Request Number
        request.setRequestNumber(generateRequestNumber());
        request.setStatus(RequestStatus.SUBMITTED);

        Request savedRequest = requestRepository.save(request);

        return mapToResponse(savedRequest);
    }


    @Override
    public List<RequestResponseDto> getRequestsByUserId(JwtPrincipal principal) {

        Long userId = principal.getUserId();

        User user = userRepository.findById(userId)
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

        // Verify that the logged-in user is the requester of this request
        if (!request.getRequester().getId().equals(userId)) {
            throw new ResourceNotFoundException("You do not have access to this request");
        }

        return mapToResponse(request);
    }

    @Override
    public RequestResponseDto reviewRequestAsAdmin(AdminReviewRequestDto dto, JwtPrincipal adminPrincipal) {
        Long adminId = adminPrincipal.getUserId();
        // Fetch the admin user
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        // Fetch the request
        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + dto.getRequestId()));

        // Verify request is in SUBMITTED status (waiting for admin review)
        if (!request.getStatus().equals(RequestStatus.SUBMITTED)) {
            throw new RuntimeException("Request is not in SUBMITTED status. Current status: " + request.getStatus());
        }

        // Set admin review details
        request.setAdminRemarks(dto.getAdminRemarks());
        request.setReviewedByAdmin(admin);
        request.setAdminReviewedAt(Instant.now());
        request.setRequiredDate(dto.getRequiredDate());

        // Update status based on approval
        if (dto.isApproved()) {
            request.setStatus(RequestStatus.PENDING_SA_APPROVAL); // Move to Super Admin review
        } else {
            // TODO: Implement rejection logic - notify requester to provide more details
            request.setStatus(RequestStatus.SUBMITTED); // Keep as submitted for requester to revise
        }

        Request updatedRequest = requestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    @Override
    public List<RequestResponseDto> getRequestsForAdminReview() {
        // Get all requests in SUBMITTED status (waiting for admin review)
        List<Request> requests = requestRepository.findByStatus(RequestStatus.SUBMITTED);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RequestResponseDto reviewRequestAsSuperAdmin(SuperAdminReviewRequestDto dto, JwtPrincipal superAdminPrincipal) {
        Long superAdminId = superAdminPrincipal.getUserId();

        // Fetch the super admin user
        User superAdmin = userRepository.findById(superAdminId)
                .orElseThrow(() -> new ResourceNotFoundException("Super Admin not found"));

        // Fetch the request
        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + dto.getRequestId()));

        // Verify request is in PENDING_SA_APPROVAL status
        if (!request.getStatus().equals(RequestStatus.PENDING_SA_APPROVAL)) {
            throw new RuntimeException("Request is not in PENDING_SA_APPROVAL status. Current status: " + request.getStatus());
        }


        // Set super admin review details
        request.setQuotationAmount(dto.getQuotationAmount());
        request.setQuotationDescription(dto.getQuotationDescription());
        request.setSuperAdminRemarks(dto.getSuperAdminRemarks());
        request.setReviewedBySuperAdmin(superAdmin);
        request.setSuperAdminReviewedAt(Instant.now());

        // Update status based on approval
        if (dto.isApproved()) {
            request.setStatus(RequestStatus.APPROVED); // Approved, ready to start work
        } else {
            // Reject and send back to admin for revision
            request.setStatus(RequestStatus.PENDING_SA_APPROVAL); // Keep for super admin to revise
        }

        Request updatedRequest = requestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    @Override
    public List<RequestResponseDto> getRequestsForSuperAdminReview() {
        // Get all requests in PENDING_SA_APPROVAL status (waiting for super admin review)
        List<Request> requests = requestRepository.findByStatus(RequestStatus.PENDING_SA_APPROVAL);
        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RequestResponseDto> getAdminRequestHistory(JwtPrincipal principal) {
        Long adminId = principal.getUserId();
        List<Request> requests = requestRepository.findByReviewedByAdminId(adminId);
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

    // Helper Method
    private String generateRequestNumber() {
        // Format: REQ-YYYY-RandomNumber
        long timestamp = System.currentTimeMillis() % 10000;
        return "REQ-" + LocalDate.now().getYear() + "-" + timestamp;
    }
}
