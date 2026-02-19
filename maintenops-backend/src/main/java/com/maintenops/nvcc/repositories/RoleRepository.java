package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.Role;
import com.maintenops.nvcc.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
