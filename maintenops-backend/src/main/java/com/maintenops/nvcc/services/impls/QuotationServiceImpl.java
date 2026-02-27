package com.maintenops.nvcc.services.impls;

import com.maintenops.nvcc.dtos.*;
import com.maintenops.nvcc.entities.*;
import com.maintenops.nvcc.enums.RequestStatus;
import com.maintenops.nvcc.repositories.*;
import com.maintenops.nvcc.services.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {

    private final RequestRepository requestRepo;
    private final MaterialRepository materialRepo;
    private final MaterialSpecificationRepository specRepo;
    private final VendorRepository vendorRepo;
    private final MaterialRateHistoryRepository rateHistoryRepo;
    private final RequestMaterialRepository requestMaterialRepo;
    private final InventoryRepository inventoryRepo;
    private final VendorPurchaseListRepository vendorPurchaseListRepo;

    @Override
    @Transactional
    public QuotationResponseDTO createQuotation(QuotationRequestDTO dto) {
        Request request = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found: " + dto.getRequestId()));

        // Delete existing materials if quotation is being revised
        requestMaterialRepo.deleteAll(requestMaterialRepo.findByRequestId(request.getId()));

        List<RequestMaterial> requestMaterials = new ArrayList<>();
        BigDecimal totalCost = BigDecimal.ZERO;
        StringBuilder descBuilder = new StringBuilder();

        for (MaterialItemDTO item : dto.getMaterials()) {
            Material material = materialRepo.findById(item.getMaterialId())
                    .orElseThrow(() -> new RuntimeException("Material not found: " + item.getMaterialId()));

            MaterialSpecification spec = item.getSpecificationId() != null
                    ? specRepo.findById(item.getSpecificationId()).orElse(null)
                    : null;

            Vendor vendor = vendorRepo.findById(item.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found: " + item.getVendorId()));

            // Get last purchase rate for reference
            BigDecimal lastRate = rateHistoryRepo
                    .findLatestRate(material.getId(), spec != null ? spec.getId() : null)
                    .map(MaterialRateHistory::getRate)
                    .orElse(null);

            BigDecimal unitPrice = item.getUnitPrice();
            BigDecimal itemTotal = item.getQuantity().multiply(unitPrice);

            RequestMaterial rm = new RequestMaterial();
            rm.setRequest(request);
            rm.setMaterial(material);
            rm.setSpecification(spec);
            rm.setMaterialName(material.getName());
            rm.setSpecificationText(spec != null ? spec.getSpecification() : null);
            rm.setQuantityRequired(item.getQuantity());
            rm.setUnit(material.getDefaultUnit());
            rm.setUnitPrice(unitPrice);
            rm.setTotalPrice(itemTotal);
            rm.setVendor(vendor);
            rm.setVendorName(vendor.getName());
            rm.setLastPurchaseRate(lastRate);


            //rm.setStatus("PENDING_PROCUREMENT");
            // On creating Quotation status is not set to PENDING_PROCUREMENT yet.
            // It will be set when the requester accepts the quotation.

            requestMaterials.add(rm);
            totalCost = totalCost.add(itemTotal);

            // Build description
            descBuilder.append(material.getName());
            if (spec != null) descBuilder.append(" (").append(spec.getSpecification()).append(")");
            descBuilder.append(" x").append(item.getQuantity()).append(", ");
        }

        requestMaterialRepo.saveAll(requestMaterials);

        // Clean up trailing comma
        String description = descBuilder.length() > 2
                ? descBuilder.substring(0, descBuilder.length() - 2)
                : "";

        // Update request with quotation data — do NOT change status here.
        // Status only changes to PENDING_SA_APPROVAL when admin explicitly submits
        // the assessment via reviewRequestAsAdmin().
        request.setTotalEstimatedCost(totalCost);
        request.setQuotationDescription(description);
        request.setEstimatedDays(dto.getEstimatedDays());
        if (dto.getQuotationNotes() != null) request.setQuotationNotes(dto.getQuotationNotes());
        requestRepo.save(request);

        // Build response
        QuotationResponseDTO response = new QuotationResponseDTO();
        response.setRequestId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
        response.setTotalCost(totalCost);
        response.setQuotationDescription(description);
        response.setEstimatedDays(dto.getEstimatedDays());
        response.setStatus(request.getStatus().name());
        response.setMaterials(requestMaterials.stream()
                .map(this::toLineItemDTO)
                .collect(Collectors.toList()));

        return response;
    }

    @Override
    public QuotationResponseDTO getQuotation(Long requestId) {
        Request request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        List<RequestMaterial> materials = requestMaterialRepo.findByRequestId(requestId);

        QuotationResponseDTO response = new QuotationResponseDTO();
        response.setRequestId(request.getId());
        response.setRequestNumber(request.getRequestNumber());
        response.setTotalCost(request.getTotalEstimatedCost());
        response.setQuotationDescription(request.getQuotationDescription());
        response.setEstimatedDays(request.getEstimatedDays());
        response.setStatus(request.getStatus().name());
        response.setMaterials(materials.stream().map(this::toLineItemDTO).collect(Collectors.toList()));

        return response;
    }

    @Override
    public List<InventoryCheckDTO> checkInventory(Long requestId) {
        List<RequestMaterial> materials = requestMaterialRepo.findByRequestId(requestId);
        List<InventoryCheckDTO> checks = new ArrayList<>();

        for (RequestMaterial rm : materials) {
            InventoryCheckDTO check = new InventoryCheckDTO();
            check.setMaterialId(rm.getMaterial().getId());
            check.setSpecificationId(rm.getSpecification() != null ? rm.getSpecification().getId() : null);
            check.setMaterialName(rm.getMaterialName());
            check.setSpecification(rm.getSpecificationText());
            check.setRequiredQuantity(rm.getQuantityRequired());

            Inventory inventory = inventoryRepo.findByMaterialAndSpec(
                    rm.getMaterial().getId(),
                    rm.getSpecification() != null ? rm.getSpecification().getId() : null
            ).orElse(null);

            if (inventory != null) {
                check.setAvailableQuantity(inventory.getQuantityAvailable());
                BigDecimal shortfall = rm.getQuantityRequired().subtract(inventory.getQuantityAvailable());
                check.setShortfall(shortfall.max(BigDecimal.ZERO));

                if (inventory.getQuantityAvailable().compareTo(rm.getQuantityRequired()) >= 0) {
                    check.setStatus("SUFFICIENT");
                } else if (inventory.getQuantityAvailable().compareTo(BigDecimal.ZERO) > 0) {
                    check.setStatus("INSUFFICIENT");
                } else {
                    check.setStatus("NOT_AVAILABLE");
                }
            } else {
                check.setAvailableQuantity(BigDecimal.ZERO);
                check.setShortfall(rm.getQuantityRequired());
                check.setStatus("NOT_AVAILABLE");
            }

            checks.add(check);
        }

        return checks;
    }

    // processApprovedQuotation removed — spec says system does not track inventory

    @Override
    @Transactional
    public void generateVendorPurchaseList(Long requestId) {
        List<RequestMaterial> pendingItems = requestMaterialRepo.findByRequestId(requestId)
                .stream()
                .filter(rm -> "PENDING_PROCUREMENT".equals(rm.getStatus()))
                .collect(Collectors.toList());

        // Group by vendor + material + specification
        Map<String, List<RequestMaterial>> grouped = pendingItems.stream()
                .collect(Collectors.groupingBy(rm ->
                        rm.getVendor().getId() + "_" + rm.getMaterial().getId() + "_" +
                        (rm.getSpecification() != null ? rm.getSpecification().getId() : "null")));

        List<VendorPurchaseList> purchaseLists = new ArrayList<>();

        for (Map.Entry<String, List<RequestMaterial>> entry : grouped.entrySet()) {
            List<RequestMaterial> group = entry.getValue();
            RequestMaterial first = group.get(0);

            BigDecimal totalQty = group.stream()
                    .map(RequestMaterial::getQuantityRequired)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            VendorPurchaseList vpl = new VendorPurchaseList();
            vpl.setVendor(first.getVendor());
            vpl.setVendorName(first.getVendorName());
            vpl.setMaterial(first.getMaterial());
            vpl.setSpecification(first.getSpecification());
            vpl.setMaterialName(first.getMaterialName());
            vpl.setSpecificationText(first.getSpecificationText());
            vpl.setTotalQuantity(totalQty);
            vpl.setUnit(first.getUnit());
            vpl.setRatePerUnit(first.getUnitPrice());
            vpl.setTotalPrice(first.getUnitPrice().multiply(totalQty));
            vpl.setIsPurchased(false);

            purchaseLists.add(vpl);
        }

        vendorPurchaseListRepo.saveAll(purchaseLists);
    }

    private MaterialLineItemDTO toLineItemDTO(RequestMaterial rm) {
        MaterialLineItemDTO dto = new MaterialLineItemDTO();
        dto.setId(rm.getId());
        dto.setMaterialName(rm.getMaterialName());
        dto.setSpecification(rm.getSpecificationText());
        dto.setQuantity(rm.getQuantityRequired());
        dto.setUnit(rm.getUnit());
        dto.setUnitPrice(rm.getUnitPrice());
        dto.setTotalPrice(rm.getTotalPrice());
        dto.setVendorName(rm.getVendorName());
        dto.setLastPurchaseRate(rm.getLastPurchaseRate());
        dto.setStatus(rm.getStatus());
        return dto;
    }
}
