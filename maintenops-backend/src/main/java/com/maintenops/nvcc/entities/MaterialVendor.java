package com.maintenops.nvcc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_vendors",
       uniqueConstraints = @UniqueConstraint(columnNames = {"material_id", "vendor_id"}))
@Data
public class MaterialVendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "is_preferred")
    private Boolean isPreferred = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
