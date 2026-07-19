package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.DeptDto;
import com.maintenops.nvcc.entities.ServiceDepartment;
import com.maintenops.nvcc.repositories.ServiceDepartmentRepository;
import com.maintenops.nvcc.services.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final ServiceDepartmentRepository serviceDepartmentRepository;
    private final ModelMapper modelMapper;


    @Override
    public void createServiceDepartment(DeptDto dto) {
        ServiceDepartment dept = modelMapper.map(dto, ServiceDepartment.class);
        serviceDepartmentRepository.save(dept);
    }


    @Override
    public List<DeptDto> getServiceDepartments() {
        return serviceDepartmentRepository.findAll()
                .stream()
                .map(dept -> modelMapper.map(dept, DeptDto.class))
                .toList();
    }
}
