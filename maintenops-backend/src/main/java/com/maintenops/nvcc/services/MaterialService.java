package com.maintenops.nvcc.services;

import com.maintenops.nvcc.dtos.MaterialSearchDTO;
import java.util.List;

public interface MaterialService {
    List<MaterialSearchDTO> searchMaterials(String query);
    MaterialSearchDTO getMaterialDetails(Long materialId);
}
