package com.maintenops.nvcc.config;

import com.maintenops.nvcc.entities.*;
import com.maintenops.nvcc.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Seeds initial reference data: materials, vendors, mappings, sample rates, and inventory.
 * Only runs if the materials table is empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MaterialRepository materialRepo;
    private final MaterialSpecificationRepository specRepo;
    private final VendorRepository vendorRepo;
    private final MaterialVendorRepository materialVendorRepo;
    private final MaterialRateHistoryRepository rateHistoryRepo;
    private final InventoryRepository inventoryRepo;

    @Override
    @Transactional
    public void run(String... args) {
        if (materialRepo.count() > 0) {
            log.info("[DataInitializer] Seed data already exists — skipping.");
            return;
        }

        log.info("[DataInitializer] Seeding reference data...");

        // ── 1. Materials ───────────────────────────────────────────────────────────
        Material ply       = saveMaterial("Ply",          "Material", "sqft");
        Material sunmica   = saveMaterial("Sunmica",       "Material", "sheet");
        Material fevicol   = saveMaterial("Fevicol",       "Material", "bottle");
        Material ironNails = saveMaterial("Iron Nails",    "Hardware", "kg");
        Material labor     = saveMaterial("Labor Charges", "Labor",    "job");
        Material paint     = saveMaterial("Paint",         "Material", "litre");
        Material screws    = saveMaterial("Screws",        "Hardware", "packet");
        Material sandpaper = saveMaterial("Sandpaper",     "Hardware", "sheet");
        Material polish    = saveMaterial("Wood Polish",   "Material", "litre");
        Material hinges    = saveMaterial("Hinges",        "Hardware", "piece");

        // ── 2. Specifications ─────────────────────────────────────────────────────
        MaterialSpecification ply6mm  = saveSpec(ply,       "6mm");
        MaterialSpecification ply8mm  = saveSpec(ply,       "8mm");
        MaterialSpecification ply9mm  = saveSpec(ply,       "9mm");
        MaterialSpecification ply12mm = saveSpec(ply,       "12mm");
        MaterialSpecification sunStd  = saveSpec(sunmica,   "Standard");
        MaterialSpecification sunPrem = saveSpec(sunmica,   "Premium");
        MaterialSpecification sunDes  = saveSpec(sunmica,   "Designer");
        MaterialSpecification fevi500 = saveSpec(fevicol,   "500ml");
        MaterialSpecification fevi1kg = saveSpec(fevicol,   "1kg");
        MaterialSpecification nail1   = saveSpec(ironNails, "1 inch");
        MaterialSpecification nail2   = saveSpec(ironNails, "2 inch");
        MaterialSpecification labCarp = saveSpec(labor,     "Carpentry");
        MaterialSpecification labElec = saveSpec(labor,     "Electrical");
        MaterialSpecification labWeld = saveSpec(labor,     "Welding");

        // ── 3. Vendors ────────────────────────────────────────────────────────────
        Vendor vendorA = saveVendor("Vendor A - Timber Supplies", "Ramesh Kumar",  "9876543210", "ramesh@vendora.com");
        Vendor vendorB = saveVendor("Vendor B - Hardware Store",  "Suresh Patil",  "9876543211", "suresh@vendorb.com");
        Vendor vendorC = saveVendor("Vendor C - Paints & Polish", "Mahesh Shah",   "9876543212", "mahesh@vendorc.com");

        // ── 4. Material-Vendor Mappings ────────────────────────────────────────────
        saveMaterialVendor(ply,       vendorA, true);
        saveMaterialVendor(ply,       vendorB, false);
        saveMaterialVendor(sunmica,   vendorA, true);
        saveMaterialVendor(fevicol,   vendorB, true);
        saveMaterialVendor(ironNails, vendorB, true);
        saveMaterialVendor(paint,     vendorC, true);
        saveMaterialVendor(polish,    vendorC, true);
        saveMaterialVendor(screws,    vendorB, true);
        saveMaterialVendor(sandpaper, vendorB, true);
        saveMaterialVendor(hinges,    vendorB, true);

        // ── 5. Rate History (sample) ──────────────────────────────────────────────
        saveRate(ply,       ply8mm,  vendorA, new BigDecimal("150.00"), LocalDate.of(2025, 1, 15));
        saveRate(ply,       ply6mm,  vendorA, new BigDecimal("120.00"), LocalDate.of(2025, 2, 1));
        saveRate(sunmica,   sunPrem, vendorA, new BigDecimal("400.00"), LocalDate.of(2025, 1, 20));
        saveRate(sunmica,   sunStd,  vendorA, new BigDecimal("300.00"), LocalDate.of(2025, 2, 5));
        saveRate(fevicol,   fevi1kg, vendorB, new BigDecimal("180.00"), LocalDate.of(2025, 2, 1));

        // ── 6. Inventory (sample stocks) ─────────────────────────────────────────
        saveInventory(ply,       ply8mm,  new BigDecimal("25.0"),  "sqft");
        saveInventory(fevicol,   fevi1kg, new BigDecimal("5.0"),   "bottle");
        saveInventory(ironNails, nail2,   new BigDecimal("10.0"),  "kg");

        log.info("[DataInitializer] Seed data inserted successfully.");
    }

    private Material saveMaterial(String name, String category, String unit) {
        Material m = new Material();
        m.setName(name);
        m.setCategory(category);
        m.setDefaultUnit(unit);
        m.setIsActive(true);
        return materialRepo.save(m);
    }

    private MaterialSpecification saveSpec(Material material, String spec) {
        MaterialSpecification s = new MaterialSpecification();
        s.setMaterial(material);
        s.setSpecification(spec);
        s.setIsActive(true);
        return specRepo.save(s);
    }

    private Vendor saveVendor(String name, String contact, String phone, String email) {
        Vendor v = new Vendor();
        v.setName(name);
        v.setContactPerson(contact);
        v.setPhone(phone);
        v.setEmail(email);
        v.setIsActive(true);
        return vendorRepo.save(v);
    }

    private void saveMaterialVendor(Material material, Vendor vendor, boolean preferred) {
        MaterialVendor mv = new MaterialVendor();
        mv.setMaterial(material);
        mv.setVendor(vendor);
        mv.setIsPreferred(preferred);
        materialVendorRepo.save(mv);
    }

    private void saveRate(Material material, MaterialSpecification spec, Vendor vendor,
                          BigDecimal rate, LocalDate date) {
        MaterialRateHistory h = new MaterialRateHistory();
        h.setMaterial(material);
        h.setSpecification(spec);
        h.setVendor(vendor);
        h.setRate(rate);
        h.setPurchaseDate(date);
        rateHistoryRepo.save(h);
    }

    private void saveInventory(Material material, MaterialSpecification spec,
                               BigDecimal qty, String unit) {
        Inventory inv = new Inventory();
        inv.setMaterial(material);
        inv.setSpecification(spec);
        inv.setQuantityAvailable(qty);
        inv.setUnit(unit);
        inventoryRepo.save(inv);
    }
}
