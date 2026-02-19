package com.maintenops.nvcc.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class JwtPrincipal {
    private Long userId;
    private String username;
    private String email;
    private Long orgDeptId;
    private List<String> roles;
}
