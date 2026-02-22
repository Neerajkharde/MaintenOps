package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.MaterialVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MaterialVendorRepository extends JpaRepository<MaterialVendor, Long> {

    List<MaterialVendor> findByMaterialId(Long materialId);

    @Query("SELECT mv FROM MaterialVendor mv WHERE mv.material.id = :materialId AND mv.isPreferred = true")
    Optional<MaterialVendor> findPreferredVendor(@Param("materialId") Long materialId);
}
