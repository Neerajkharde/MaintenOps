package com.maintenops.nvcc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_purchase_lists")
@Data
public class VendorPurchaseList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_id")
    private MaterialSpecification specification;

    // Denormalized for display without joins
    @Column(name = "material_name")
    private String materialName;

    private String specificationText;

    @Column(name = "total_quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalQuantity;

    private String unit;

    @Column(name = "list_date")
    private LocalDate listDate = LocalDate.now();

    @Column(name = "is_purchased")
    private Boolean isPurchased = false;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;

    @Column(name = "invoice_url")
    private String invoiceUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
