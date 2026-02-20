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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/request")
public class RequestController {
    private final RequestService requestService;

    @PostMapping
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<RequestResponseDto> createRequest(
            @Valid
            @RequestBody RequestRequestDto request,
            @AuthenticationPrincipal JwtPrincipal principal) {


        RequestResponseDto savedRequest = requestService.createRequest(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<List<RequestResponseDto>> getMyRequests(
            @AuthenticationPrincipal JwtPrincipal principal) {

        List<RequestResponseDto> requests =
                requestService.getRequestsByUserId(principal);

        return ResponseEntity.ok(requests);
    }

    // Update the request
}
