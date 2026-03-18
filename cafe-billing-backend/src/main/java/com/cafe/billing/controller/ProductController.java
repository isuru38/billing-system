package com.cafe.billing.controller;

import com.cafe.billing.model.Product;
import com.cafe.billing.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/available")
    public List<Product> getAvailable() {
        return productService.getAvailableProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/search")
    public List<Product> search(
            @RequestParam String keyword) {
        return productService.search(keyword);
    }

    @PostMapping
    public ResponseEntity<Product> create(
            @Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.create(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @Valid @RequestBody Product product) {
        return ResponseEntity.ok(
                productService.update(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(
                Map.of("message", "Product deleted successfully"));
    }
}