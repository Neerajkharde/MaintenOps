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

    @Override
    public List<MaterialSearchDTO> getAllMaterials() {
        return materialRepo.findByIsActiveTrue().stream()
                .map(this::toSearchDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialSearchDTO createMaterial(MaterialRequestDTO dto, Long userId) {
        Material material = new Material();
        material.setName(dto.getName());
        material.setCategory(dto.getCategory());
        material.setDefaultUnit(dto.getDefaultUnit());
        material.setCreatedByUserId(userId);
        material.setIsActive(true);
        
        Material saved = materialRepo.save(material);
        
        if (dto.getSpecifications() != null) {
            for (SpecificationRequestDTO specDto : dto.getSpecifications()) {
                MaterialSpecification spec = new MaterialSpecification();
                spec.setMaterial(saved);
                spec.setSpecification(specDto.getSpecification());
                spec.setDescription(specDto.getDescription());
                spec.setIsActive(true);
                specRepo.save(spec);
            }
        }
        
        return getMaterialDetails(saved.getId());
    }

    @Override
    public MaterialSearchDTO updateMaterial(Long id, MaterialRequestDTO dto) {
        Material material = materialRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        material.setName(dto.getName());
        material.setCategory(dto.getCategory());
        material.setDefaultUnit(dto.getDefaultUnit());
        
        Material saved = materialRepo.save(material);
        
        // Simple spec update: deactivate old ones not in list and add new ones
        // In a real app we'd match IDs, but for now let's keep it simple or implement proper sync
        if (dto.getSpecifications() != null) {
            // Deactivate all old specs for this material first (or sync)
            List<MaterialSpecification> existingSpecs = specRepo.findByMaterialIdAndIsActiveTrue(id);
            for (MaterialSpecification es : existingSpecs) {
                // If not in dto, deactivate
                boolean stillExists = dto.getSpecifications().stream()
                    .anyMatch(s -> s.getId() != null && s.getId().equals(es.getId()));
                if (!stillExists) {
                    es.setIsActive(false);
                    specRepo.save(es);
                }
            }
            
            for (SpecificationRequestDTO specDto : dto.getSpecifications()) {
                if (specDto.getId() != null) {
                    MaterialSpecification es = specRepo.findById(specDto.getId()).orElse(null);
                    if (es != null) {
                        es.setSpecification(specDto.getSpecification());
                        es.setDescription(specDto.getDescription());
                        specRepo.save(es);
                    }
                } else {
                    MaterialSpecification ns = new MaterialSpecification();
                    ns.setMaterial(saved);
                    ns.setSpecification(specDto.getSpecification());
                    ns.setDescription(specDto.getDescription());
                    ns.setIsActive(true);
                    specRepo.save(ns);
                }
            }
        }
        
        return getMaterialDetails(id);
    }

    @Override
    public void deleteMaterial(Long id) {
        Material material = materialRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        material.setIsActive(false);
        materialRepo.save(material);
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
