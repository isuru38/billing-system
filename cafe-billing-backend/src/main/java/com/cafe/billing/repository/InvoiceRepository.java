package com.cafe.billing.repository;

import com.cafe.billing.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findByOrderId(Long orderId);

    List<Invoice> findByIssuedAtBetween(
            LocalDateTime start, LocalDateTime end);
}