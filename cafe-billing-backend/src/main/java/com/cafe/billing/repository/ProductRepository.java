package com.cafe.billing.repository;

import com.cafe.billing.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByIsAvailableTrue();

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);
}