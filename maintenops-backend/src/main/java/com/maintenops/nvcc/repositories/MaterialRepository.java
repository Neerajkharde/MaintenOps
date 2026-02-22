package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findByIsActiveTrue();

    Optional<Material> findByNameIgnoreCase(String name);

    @Query("SELECT m FROM Material m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) AND m.isActive = true")
    List<Material> searchByName(@Param("query") String query);
}
