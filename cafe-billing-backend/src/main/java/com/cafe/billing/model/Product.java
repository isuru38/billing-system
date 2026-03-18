package com.cafe.billing.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(nullable = false)
    private BigDecimal price;

    private String category;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity = 0;

    private Boolean isAvailable = true;

    private String imageUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}