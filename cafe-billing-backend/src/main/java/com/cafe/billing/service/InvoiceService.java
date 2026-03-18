package com.cafe.billing.service;

import com.cafe.billing.model.Invoice;
import com.cafe.billing.model.Order;
import com.cafe.billing.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Invoice generateForOrder(Order order) {
        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setIsPaid(true);
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    public Invoice getById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found: " + id));
    }

    public Invoice getByNumber(String invoiceNumber) {
        return invoiceRepository
                .findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invoice not found: " + invoiceNumber));
    }

    public Invoice getByOrderId(Long orderId) {
        return invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No invoice found for order: " + orderId));
    }

    public List<Invoice> getTodaysInvoices() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return invoiceRepository
                .findByIssuedAtBetween(start, end);
    }

    private String generateInvoiceNumber() {
        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String unique = String.valueOf(
                System.currentTimeMillis()).substring(7);
        return "INV-" + date + "-" + unique;
    }
}