package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.RequestRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.entities.OrganizationDepartment;
import com.maintenops.nvcc.entities.Request;
import com.maintenops.nvcc.entities.ServiceDepartment;
import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.enums.RequestStatus;
import com.maintenops.nvcc.exceptions.ResourceNotFoundException;
import com.maintenops.nvcc.repositories.OrgDepartmentRepository;
import com.maintenops.nvcc.repositories.RequestRepository;
import com.maintenops.nvcc.repositories.ServiceDepartmentRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.RequestService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final OrgDepartmentRepository orgDeptRepository;
    private final ServiceDepartmentRepository serviceDeptRepository;

    private RequestResponseDto mapToResponse(Request request) {

        RequestResponseDto response = new RequestResponseDto();

        response.setId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
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

        return response;
    }

    public RequestResponseDto createRequest(RequestRequestDto dto, JwtPrincipal principal) {

        Request request = new Request();

        request.setItemDescription(dto.getItemDescription());
        request.setRequiredDate(dto.getRequiredDate());
        request.setUrgencyRequested(dto.isUrgencyRequested());
        request.setUrgencyReason(dto.getUrgencyReason());

        // 2. Fetch the Requester
        Long userId = principal.getUserId();
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setRequester(requester);

        // 3. Resolve Organization Department by Name (from DTO)
        OrganizationDepartment orgDept = orgDeptRepository.findByName(dto.getOrganizationDepartmentName())
                .orElseThrow(() -> new ResourceNotFoundException("Org Dept not found: " + dto.getOrganizationDepartmentName()));
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

    // Helper Method
    private String generateRequestNumber() {
        // Format: REQ-YYYY-RandomNumber
        long timestamp = System.currentTimeMillis() % 10000;
        return "REQ-" + LocalDate.now().getYear() + "-" + timestamp;
    }
}
