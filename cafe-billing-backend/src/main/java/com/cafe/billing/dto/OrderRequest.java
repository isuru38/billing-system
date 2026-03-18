package com.cafe.billing.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private Long customerId;
    private String paymentMethod;
    private String notes;
    private BigDecimal discountAmount;
    private List<OrderItemRequest> items;
}