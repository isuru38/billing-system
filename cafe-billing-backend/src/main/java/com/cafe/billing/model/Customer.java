package com.cafe.billing.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name is required")
    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String phone;

    private String email;

    private Integer loyaltyPoints = 0;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}