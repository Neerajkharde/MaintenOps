package com.maintenops.nvcc.controllers;

import com.maintenops.nvcc.dtos.VendorDTO;
import com.maintenops.nvcc.entities.Vendor;
import com.maintenops.nvcc.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorRepository vendorRepo;

    /**
     * Get all active vendors for dropdown selection
     * GET /api/vendors
     */
    @GetMapping
    public ResponseEntity<List<VendorDTO>> getAllVendors() {
        List<Vendor> vendors = vendorRepo.findByIsActiveTrue();
        return ResponseEntity.ok(vendors.stream().map(v -> {
            VendorDTO dto = new VendorDTO();
            dto.setId(v.getId());
            dto.setName(v.getName());
            dto.setContactPerson(v.getContactPerson());
            dto.setPhone(v.getPhone());
            return dto;
        }).collect(Collectors.toList()));
    }
}
