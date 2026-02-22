package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.MaterialRateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MaterialRateHistoryRepository extends JpaRepository<MaterialRateHistory, Long> {

    @Query("SELECT mrh FROM MaterialRateHistory mrh " +
           "WHERE mrh.material.id = :materialId " +
           "AND (:specId IS NULL OR mrh.specification.id = :specId) " +
           "ORDER BY mrh.purchaseDate DESC " +
           "LIMIT 1")
    Optional<MaterialRateHistory> findLatestRate(@Param("materialId") Long materialId,
                                                  @Param("specId") Long specId);
}
