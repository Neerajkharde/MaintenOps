package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.MaterialRequestDTO;
import com.maintenops.nvcc.dtos.MaterialSearchDTO;
import com.maintenops.nvcc.security.JwtPrincipal;
import com.maintenops.nvcc.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
     * Get all active materials for dropdown selection
     * GET /api/materials
     */
    @GetMapping
    public ResponseEntity<List<MaterialSearchDTO>> getAllMaterials() {
        return ResponseEntity.ok(materialService.getAllMaterials());
    }

    /**
     * Get material details by ID (for material picker)
     * GET /api/materials/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<MaterialSearchDTO> getMaterialById(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.getMaterialDetails(id));
    }

    /**
     * Create a new material (Admin only)
     * POST /api/materials
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaterialSearchDTO> createMaterial(
            @RequestBody MaterialRequestDTO dto,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(materialService.createMaterial(dto, principal.getUserId()));
    }

    /**
     * Update an existing material (Admin only)
     * PUT /api/materials/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaterialSearchDTO> updateMaterial(
            @PathVariable Long id,
            @RequestBody MaterialRequestDTO dto) {
        return ResponseEntity.ok(materialService.updateMaterial(id, dto));
    }

    /**
     * Delete (deactivate) a material (Admin only)
     * DELETE /api/materials/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }
}
