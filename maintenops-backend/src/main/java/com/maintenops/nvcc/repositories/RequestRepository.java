package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.Request;
import com.maintenops.nvcc.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByRequesterId(Long requesterId);

    List<Request> findByStatus(RequestStatus status);

    List<Request> findByReviewedByAdminId(Long adminId);

    List<Request> findByReviewedBySuperAdminId(Long superAdminId);
}
