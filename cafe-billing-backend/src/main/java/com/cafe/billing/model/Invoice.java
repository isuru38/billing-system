package com.cafe.billing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Order order;

    private Boolean isPaid = true;

    @Column(updatable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();
}