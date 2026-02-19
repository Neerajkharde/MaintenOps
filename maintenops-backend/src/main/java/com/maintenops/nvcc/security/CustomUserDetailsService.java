package com.maintenops.nvcc.security;

import com.maintenops.nvcc.entities.User;
import com.maintenops.nvcc.exceptions.ResourceNotFoundException;
import com.maintenops.nvcc.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new ResourceNotFoundException("No user found with this email"));

        return user;
    }
}
