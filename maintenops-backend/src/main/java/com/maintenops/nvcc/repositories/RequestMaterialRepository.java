package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.RequestMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RequestMaterialRepository extends JpaRepository<RequestMaterial, Long> {

    List<RequestMaterial> findByRequestId(Long requestId);

    @Query("SELECT rm FROM RequestMaterial rm WHERE rm.status = 'PENDING_PURCHASE'")
    List<RequestMaterial> findPendingPurchases();
}
