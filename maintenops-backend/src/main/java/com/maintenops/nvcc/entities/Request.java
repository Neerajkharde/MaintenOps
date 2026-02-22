package com.maintenops.nvcc.entities;

import com.maintenops.nvcc.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "requests")
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id (PK)

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber; // mobile_number

    @Column(unique = true, nullable = false)
    private String requestNumber; // request_number (unique)

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // requester_id (FK → users.id)

    @ManyToOne
    @JoinColumn(name = "service_department_id", nullable = false)
    private ServiceDepartment serviceDepartment; // service_department_id (FK)
    // Services like Electrical, Plumbing, etc.

    @ManyToOne
    @JoinColumn(name = "org_dept_id", nullable = false)
    private OrganizationDepartment organizationDepartment; // organization_department_id (FK)
    // Departments like Jivadaya, EM, Campus Programs, etc.

    @Column(name = "item_description", nullable = false, columnDefinition = "TEXT")
    private String itemDescription; // item_description

    @Column(name = "required_date")
    private Instant requiredDate; // required_date
    // TODO: Think what to do here


    // --- Urgency Module  ---
    @Column(name = "urgency_requested")
    private boolean urgencyRequested; // urgency_requested (boolean)

    @Column(name = "urgency_reason", columnDefinition = "TEXT")
    private String urgencyReason;

    @Column(name = "urgency_approved")
    private Boolean urgencyApproved; // urgency_approved (boolean)

    @ManyToOne
    @JoinColumn(name = "urgency_approved_by")
    private User urgencyApprovedBy; // urgency_approved_by (FK → users.id)

    @Column(name = "urgency_approved_at")
    private Instant urgencyApprovedAt;

    @Column(name = "urgency_rejection_reason")
    private String urgencyRejectionReason;

    // --- Admin Review Module ---
    @Column(name = "admin_remarks", columnDefinition = "TEXT")
    private String adminRemarks; // Admin's comments on the request

    @ManyToOne
    @JoinColumn(name = "reviewed_by_admin_id")
    private User reviewedByAdmin; // FK → users.id (Admin who reviewed)

    @Column(name = "admin_reviewed_at")
    private Instant adminReviewedAt; // Timestamp when admin reviewed

    // --- Super Admin & Quotation Module ---
    @Column(name = "quotation_amount")
    private Double quotationAmount; // Cost estimate by Super Admin

    @Column(name = "quotation_description", columnDefinition = "TEXT")
    private String quotationDescription; // Quotation details

    @Column(name = "total_estimated_cost", precision = 10, scale = 2)
    private java.math.BigDecimal totalEstimatedCost; // Auto-calculated from material picker

    @Column(name = "estimated_days")
    private Integer estimatedDays; // Admin sets during quotation creation

    @Column(name = "quotation_notes", columnDefinition = "TEXT")
    private String quotationNotes; // Internal admin notes (not shown to requester)

    @Column(name = "super_admin_remarks", columnDefinition = "TEXT")
    private String superAdminRemarks; // Super Admin's comments

    @ManyToOne
    @JoinColumn(name = "reviewed_by_super_admin_id")
    private User reviewedBySuperAdmin; // FK → users.id (Super Admin who reviewed)

    @Column(name = "super_admin_reviewed_at")
    private Instant superAdminReviewedAt; // Timestamp when super admin reviewed

    // --- Status & Security ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status; // status

    // --- Audit Timestamps ---
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.status == null) {
            this.status = RequestStatus.SUBMITTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}