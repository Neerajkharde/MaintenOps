package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.entities.*;
import com.maintenops.nvcc.repositories.*;
import com.maintenops.nvcc.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepo;
    private final MaterialSpecificationRepository specRepo;
    private final MaterialVendorRepository materialVendorRepo;
    private final MaterialRateHistoryRepository rateHistoryRepo;

    @Override
    public List<MaterialSearchDTO> searchMaterials(String query) {
        List<Material> materials = (query != null && !query.isBlank())
                ? materialRepo.searchByName(query)
                : materialRepo.findByIsActiveTrue();

        return materials.stream()
                .map(this::toSearchDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialSearchDTO getMaterialDetails(Long materialId) {
        Material material = materialRepo.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found: " + materialId));
        return toSearchDTO(material);
    }

    private MaterialSearchDTO toSearchDTO(Material material) {
        MaterialSearchDTO dto = new MaterialSearchDTO();
        dto.setMaterialId(material.getId());
        dto.setMaterialName(material.getName());
        dto.setCategory(material.getCategory());
        dto.setDefaultUnit(material.getDefaultUnit());

        // Get specifications
        List<MaterialSpecification> specs = specRepo.findByMaterialIdAndIsActiveTrue(material.getId());
        dto.setSpecifications(specs.stream().map(spec -> {
            SpecificationDTO s = new SpecificationDTO();
            s.setId(spec.getId());
            s.setSpecification(spec.getSpecification());
            s.setDescription(spec.getDescription());
            return s;
        }).collect(Collectors.toList()));

        // Get mapped vendors
        List<MaterialVendor> materialVendors = materialVendorRepo.findByMaterialId(material.getId());
        dto.setVendors(materialVendors.stream().map(mv -> {
            VendorDTO v = new VendorDTO();
            v.setId(mv.getVendor().getId());
            v.setName(mv.getVendor().getName());
            v.setIsPreferred(mv.getIsPreferred());
            v.setContactPerson(mv.getVendor().getContactPerson());
            v.setPhone(mv.getVendor().getPhone());
            return v;
        }).collect(Collectors.toList()));

        // Set last purchase rate (for first spec if available)
        if (!specs.isEmpty()) {
            rateHistoryRepo.findLatestRate(material.getId(), specs.get(0).getId())
                    .ifPresent(rate -> dto.setLastPurchaseRate(rate.getRate()));
        }

        return dto;
    }
}
