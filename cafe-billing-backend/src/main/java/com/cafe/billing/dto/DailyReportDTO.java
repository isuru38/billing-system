package com.cafe.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DailyReportDTO {
    private String date;
    private Long totalOrders;
    private Double totalRevenue;
    private Double totalTax;
    private Double averageOrderValue;
    private Map<String, Long> paymentMethodBreakdown;
    private List<TopProductDTO> topProducts;
}