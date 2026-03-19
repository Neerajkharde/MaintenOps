package com.maintenops.nvcc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_materials")
@Data
public class RequestMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_id")
    private MaterialSpecification specification;

    // Denormalized for history preservation (protects against master data changes)
    @Column(name = "material_name", nullable = false)
    private String materialName;

    @Column(name = "specification_text")
    private String specificationText;

    @Column(name = "quantity_required", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityRequired;

    @Column(name = "negotiation_quantity", precision = 10, scale = 2)
    private BigDecimal negotiationQuantity; // Quantity requested by user

    @Column(name = "negotiation_reason", columnDefinition = "TEXT")
    private String negotiationReason; // Reason for change requested by user

    @Column(nullable = false)
    private String unit;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice; // Price snapshot at quotation time

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice; // quantity * unit_price

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "vendor_name")
    private String vendorName; // Denormalized

    @Column(nullable = false)
    private String status = "PENDING_PROCUREMENT";
    // PENDING_PROCUREMENT, PROCURED

    @Column(name = "last_purchase_rate", precision = 10, scale = 2)
    private BigDecimal lastPurchaseRate; // Reference for SA

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
