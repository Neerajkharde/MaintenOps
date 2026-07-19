package com.maintenops.nvcc.config;

import com.maintenops.nvcc.dtos.UserRequestDto;
import com.maintenops.nvcc.entities.Role;
import com.maintenops.nvcc.enums.ERole;
import com.maintenops.nvcc.repositories.RoleRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final com.maintenops.nvcc.repositories.ServiceDepartmentRepository serviceDepartmentRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data seeding for dev profile...");

        // 1. Seed Roles
        seedRoles();

        // 2. Seed Service Departments
        seedServiceDepartments();

        // 3. Seed Admin Users
        seedAdminUser("Superadmin Das", "superadmin@maintenops.com", "SuperAdmin#1234", ERole.SUPER_ADMIN);
        seedAdminUser("Admin Das", "admin@maintenops.com", "Admin#1234", ERole.ADMIN);

        log.info("Data seeding completed.");
    }

    private void seedRoles() {
        for (ERole eRole : ERole.values()) {
            if (roleRepository.findByName(eRole).isEmpty()) {
                log.info("Seeding role: {}", eRole);
                roleRepository.save(new Role(null, eRole));
            }
        }
    }

    private void seedServiceDepartments() {
        List<String> departments = Arrays.asList(
            "Carpentry",
            "Electrical",
            "Plumbing",
            "EM"
        );

        for (String deptName : departments) {
            if (serviceDepartmentRepository.findByName(deptName).isEmpty()) {
                log.info("Seeding service department: {}", deptName);
                com.maintenops.nvcc.entities.ServiceDepartment dept = new com.maintenops.nvcc.entities.ServiceDepartment();
                dept.setName(deptName);
                serviceDepartmentRepository.save(dept);
            }
        }
    }

    private void seedAdminUser(String username, String email, String password, ERole eRole) {
        if (!userRepository.existsByEmail(email)) {
            log.info("Seeding user: {} ({})", username, eRole);
            UserRequestDto dto = new UserRequestDto();
            dto.setUsername(username);
            dto.setEmail(email);
            dto.setPassword(password);
            dto.setMobileNumber("1234567890"); // Default mobile number for seeded accounts
            dto.setRoles(Set.of(eRole.name()));
            
            try {
                userService.createUser(dto);
                log.info("Successfully seeded user: {}", username);
            } catch (Exception e) {
                log.error("Failed to seed user {}: {}", username, e.getMessage());
            }
        } else {
            log.debug("User {} already exists, skipping seeding.", email);
        }
    }
}
