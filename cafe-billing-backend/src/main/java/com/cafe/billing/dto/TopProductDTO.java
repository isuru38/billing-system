package com.cafe.billing.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopProductDTO {
    private String productName;
    private Long totalQuantitySold;
    private BigDecimal totalRevenue;

    public TopProductDTO(String productName,
                         Long totalQuantitySold,
                         BigDecimal totalRevenue) {
        this.productName       = productName;
        this.totalQuantitySold = totalQuantitySold;
        this.totalRevenue      = totalRevenue;
    }
}