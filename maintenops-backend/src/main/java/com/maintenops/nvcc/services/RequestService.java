package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.RequestRequestDto;
import com.maintenops.nvcc.dtos.RequestResponseDto;
import com.maintenops.nvcc.entities.Request;
import com.maintenops.nvcc.security.JwtPrincipal;

import java.util.List;

public interface RequestService {
    public RequestResponseDto createRequest(RequestRequestDto request,JwtPrincipal principal);
    List<RequestResponseDto> getRequestsByUserId(JwtPrincipal principal);
}
