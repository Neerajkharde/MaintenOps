package com.maintenops.nvcc;

import com.maintenops.nvcc.entities.Role;
import com.maintenops.nvcc.enums.ERole;
import com.maintenops.nvcc.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class Application implements CommandLineRunner {

	private final RoleRepository repo;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		for (ERole role : ERole.values()) {

			repo.findByName(role)
					.orElseGet(() -> repo.save(
							new Role(null, role)
					));
		}

		System.out.println("Roles seeded successfully ✅");
	}
}
