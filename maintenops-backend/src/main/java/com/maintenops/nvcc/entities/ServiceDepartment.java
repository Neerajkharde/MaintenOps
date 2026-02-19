package com.maintenops.nvcc.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "service_departments")
public class ServiceDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Maintenance"
}
