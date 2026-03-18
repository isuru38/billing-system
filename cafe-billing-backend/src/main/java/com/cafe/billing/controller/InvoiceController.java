package com.cafe.billing.controller;

import com.cafe.billing.model.Invoice;
import com.cafe.billing.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<Invoice> getByNumber(
            @PathVariable String invoiceNumber) {
        return ResponseEntity.ok(
                invoiceService.getByNumber(invoiceNumber));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Invoice> getByOrder(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
                invoiceService.getByOrderId(orderId));
    }

    @GetMapping("/today")
    public List<Invoice> getToday() {
        return invoiceService.getTodaysInvoices();
    }
}