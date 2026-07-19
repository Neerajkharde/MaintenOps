package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.DeptDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DepartmentService {
    void createServiceDepartment(DeptDto dto);

    List<DeptDto> getServiceDepartments();
}
