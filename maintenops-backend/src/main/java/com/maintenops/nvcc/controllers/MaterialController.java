package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.MaterialSearchDTO;
import com.maintenops.nvcc.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MaterialController - provides material search for the material picker
 * Accessible by ADMIN and SUPER_ADMIN roles (via security config)
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    /**
     * Search materials by name (for material picker dropdown)
     * GET /api/materials/search?query=ply
     */
    @GetMapping("/search")
    public ResponseEntity<List<MaterialSearchDTO>> searchMaterials(
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(materialService.searchMaterials(query));
    }

    /**
     * Get full details for a specific material (specs, vendors, last rate)
     * GET /api/materials/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<MaterialSearchDTO> getMaterialDetails(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.getMaterialDetails(id));
    }
}
