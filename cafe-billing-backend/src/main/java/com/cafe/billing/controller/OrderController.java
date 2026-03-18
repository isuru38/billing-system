package com.cafe.billing.controller;

import com.cafe.billing.dto.OrderRequest;
import com.cafe.billing.model.Order;
import com.cafe.billing.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @GetMapping("/today")
    public List<Order> getToday() {
        return orderService.getTodaysOrders();
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getByCustomer(
            @PathVariable Long customerId) {
        return orderService.getByCustomer(customerId);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest request) {
        return ResponseEntity.ok(
                orderService.createOrder(request));
    }
}