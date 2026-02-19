package com.maintenops.nvcc.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "org_departments")
public class OrganizationDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Jivdaya Department, Campus Program, Book Distribution, Deity Department
}
