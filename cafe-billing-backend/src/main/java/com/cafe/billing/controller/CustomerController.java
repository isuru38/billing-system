package com.cafe.billing.controller;

import com.cafe.billing.model.Customer;
import com.cafe.billing.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Customer> getAll() {
        return customerService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<Customer> getByPhone(
            @PathVariable String phone) {
        return ResponseEntity.ok(
                customerService.getByPhone(phone));
    }

    @GetMapping("/search")
    public List<Customer> search(
            @RequestParam String keyword) {
        return customerService.search(keyword);
    }

    @PostMapping
    public ResponseEntity<Customer> create(
            @Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(
                customerService.create(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(
            @PathVariable Long id,
            @Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(
                customerService.update(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.ok(
                Map.of("message", "Customer deleted successfully"));
    }
}