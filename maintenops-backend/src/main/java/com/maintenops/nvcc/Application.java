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
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class Application{

	private final RoleRepository repo;
	private final UserService userService;
	private final DepartmentService departmentService;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
