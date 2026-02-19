package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.ServiceDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceDepartmentRepository extends JpaRepository<ServiceDepartment, Long> {
    Optional<ServiceDepartment> findByName(String name);
}
