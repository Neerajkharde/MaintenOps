package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.OrganizationDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgDepartmentRepository extends JpaRepository<OrganizationDepartment, Long> {

    Optional<OrganizationDepartment> findByName(String name);
}
