package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT i FROM Inventory i " +
           "WHERE i.material.id = :materialId " +
           "AND (:specId IS NULL OR i.specification.id = :specId)")
    Optional<Inventory> findByMaterialAndSpec(@Param("materialId") Long materialId,
                                               @Param("specId") Long specId);
}
