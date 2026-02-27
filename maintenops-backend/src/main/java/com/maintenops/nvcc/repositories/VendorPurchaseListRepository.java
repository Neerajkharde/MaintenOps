package com.maintenops.nvcc.repositories;

import com.maintenops.nvcc.entities.VendorPurchaseList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VendorPurchaseListRepository extends JpaRepository<VendorPurchaseList, Long> {

    List<VendorPurchaseList> findByIsPurchasedFalse();

    List<VendorPurchaseList> findByVendorId(Long vendorId);

    List<VendorPurchaseList> findByMaterialIdAndVendorId(Long materialId, Long vendorId);

    @Query("SELECT vpl FROM VendorPurchaseList vpl " +
           "WHERE (:vendorId IS NULL OR vpl.vendor.id = :vendorId) " +
           "ORDER BY vpl.listDate DESC, vpl.vendor.name ASC")
    List<VendorPurchaseList> findByVendorIdOrAll(@Param("vendorId") Long vendorId);
}
