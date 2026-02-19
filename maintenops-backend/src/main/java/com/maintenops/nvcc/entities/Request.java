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

    @Column(unique = true, nullable = false)
    private String requestNumber; // request_number (unique)

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // requester_id (FK → users.id)

    @ManyToOne
    @JoinColumn(name = "service_department_id", nullable = false)
    private ServiceDepartment serviceDepartment; // service_department_id (FK)

    @ManyToOne
    @JoinColumn(name = "org_dept_id", nullable = false)
    private OrganizationDepartment organizationDepartment; // organization_department_id (FK)

    @Column(name = "item_description", nullable = false, columnDefinition = "TEXT")
    private String itemDescription; // item_description

    @Column(name = "required_date")
    private Instant requiredDate; // required_date

    // TODO: do after frontend gets prepared
//    @Column(name = "photo_url")
//    private String photoUrl;

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