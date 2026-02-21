package com.maintenops.nvcc;

import java.util.Set;

import com.maintenops.nvcc.dtos.DeptDto;
import com.maintenops.nvcc.dtos.UserRequestDto;
import com.maintenops.nvcc.entities.OrganizationDepartment;
import com.maintenops.nvcc.entities.Role;
import com.maintenops.nvcc.enums.ERole;
import com.maintenops.nvcc.repositories.RoleRepository;
import com.maintenops.nvcc.services.DepartmentService;
import com.maintenops.nvcc.services.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class Application implements CommandLineRunner {

	private final RoleRepository repo;
	private final UserService userService;
	private final DepartmentService departmentService;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		for (ERole role : ERole.values()) {

			repo.findByName(role)
					.orElseGet(() -> repo.save(
							new Role(null, role)));
		}

		System.out.println("Roles seeded successfully ✅");
		// DeptDto deptDto = DeptDto.builder()
		// 		.name("ISKCON")
		// 		.build();
		// departmentService.createOrgDepartment(deptDto);
		// System.out.println("Department created successfully ✅");

		// UserRequestDto dto = UserRequestDto.builder()
		// 		.username("Super Admin")
		// 		.email("super@example.com")
		// 		.password("123456")
		// 		.orgDeptName("ISKCON")
		// 		.roles(Set.of("SUPER_ADMIN"))
		// 		.build();

		// userService.createUser(dto);
		// System.out.println("Super Admin created successfully ✅");
	}
}
