package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.UserRequestDto;
import com.maintenops.nvcc.dtos.UserResponseDto;
import com.maintenops.nvcc.entities.OrganizationDepartment;
import com.maintenops.nvcc.entities.Role;
import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.enums.ERole;
import com.maintenops.nvcc.exceptions.ResourceAlreadyExistsException;
import com.maintenops.nvcc.exceptions.ResourceNotFoundException;
import com.maintenops.nvcc.repositories.OrgDepartmentRepository;
import com.maintenops.nvcc.repositories.RoleRepository;
import com.maintenops.nvcc.repositories.UserRepository;
import com.maintenops.nvcc.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final OrgDepartmentRepository orgDeptRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto createUser(UserRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("User already exists with this email");
        }

        // 1. Map DTO to Entity (Maps username, email, password)
        // We do this first to initialize the User object
        User user = modelMapper.map(dto, User.class);

        // 2. Resolve Department by Name
        // Since the frontend sends a String from a dropdown, we find the real Entity
        if (dto.getOrgDeptName() != null) {
            OrganizationDepartment dept = orgDeptRepository.findByName(dto.getOrgDeptName())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + dto.getOrgDeptName()));
            user.setOrganizationDepartment(dept);
        }

        // 3. Resolve Roles (String -> ERole Enum -> Role Entity)
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(roleName -> {
                        try {
                            // Convert the String from JSON to the actual Enum type
                            ERole eRole = ERole.valueOf(roleName);
                            return roleRepository.findByName(eRole)
                                    .orElseThrow(() -> new ResourceNotFoundException("Role " + roleName + " not found in DB"));
                        } catch (IllegalArgumentException e) {
                            throw new RuntimeException("Invalid Role name provided: " + roleName);
                        }
                    })
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        // 4. Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 5. Save the User to the database
        User savedUser = userRepository.save(user);

        // 6. Map the saved Entity back to Response DTO
        UserResponseDto response = modelMapper.map(savedUser, UserResponseDto.class);

        // Ensure the roles in the response are just a set of Strings (the Enum names)
        response.setRoles(savedUser.getRoles().stream()
                .map(role -> role.getName().name()) // Get String from Enum
                .collect(Collectors.toSet()));

        return response;
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .toList();
    }
}