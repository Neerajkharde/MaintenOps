package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.DeptDto;
import com.maintenops.nvcc.services.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dept")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;


    @PostMapping("/service")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<String> createServiceDept(@Valid @RequestBody DeptDto dto) {
        departmentService.createServiceDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Service Department Created");
    }

    @GetMapping("/service")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<DeptDto>> getServiceDepartments(){
        List<DeptDto> serviceDepartments = departmentService.getServiceDepartments();
        return ResponseEntity.ok(serviceDepartments);
    }

    // TODO: delete departments and rename (update)


}
