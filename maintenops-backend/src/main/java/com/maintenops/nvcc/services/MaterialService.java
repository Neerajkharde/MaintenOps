package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.MaterialRequestDTO;
import com.maintenops.nvcc.dtos.MaterialSearchDTO;
import java.util.List;

public interface MaterialService {
    List<MaterialSearchDTO> searchMaterials(String query);
    MaterialSearchDTO getMaterialDetails(Long materialId);
    MaterialSearchDTO createMaterial(MaterialRequestDTO dto, Long userId);
    MaterialSearchDTO updateMaterial(Long id, MaterialRequestDTO dto);
    void deleteMaterial(Long id);
    List<MaterialSearchDTO> getAllMaterials();
}
