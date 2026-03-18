package com.cafe.billing.service;

import com.cafe.billing.model.Product;
import com.cafe.billing.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findByIsAvailableTrue();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id));
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setIsAvailable(updated.getIsAvailable());
        existing.setImageUrl(updated.getImageUrl());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException(
                    "Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<Product> search(String keyword) {
        return productRepository
                .findByNameContainingIgnoreCase(keyword);
    }
}