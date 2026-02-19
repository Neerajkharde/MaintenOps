package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.UserRequestDto;
import com.maintenops.nvcc.dtos.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto createUser(UserRequestDto dto);
    List<UserResponseDto> getAllUsers();
}
