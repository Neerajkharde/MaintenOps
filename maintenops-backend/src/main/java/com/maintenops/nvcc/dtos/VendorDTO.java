package com.maintenops.nvcc.dtos;

import lombok.Data;

@Data
public class VendorDTO {
    private Long id;
    private String name;
    private Boolean isPreferred;
    private String contactPerson;
    private String phone;
}
