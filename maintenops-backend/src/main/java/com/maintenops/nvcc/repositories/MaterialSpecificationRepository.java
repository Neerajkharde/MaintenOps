package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.MaterialSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MaterialSpecificationRepository extends JpaRepository<MaterialSpecification, Long> {

    List<MaterialSpecification> findByMaterialIdAndIsActiveTrue(Long materialId);

    @Query("SELECT ms FROM MaterialSpecification ms WHERE ms.material.id = :materialId AND LOWER(ms.specification) = LOWER(:spec)")
    Optional<MaterialSpecification> findByMaterialAndSpec(@Param("materialId") Long materialId, @Param("spec") String spec);
}
