package com.cafe.billing.repository;

import com.cafe.billing.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhone(String phone);

    List<Customer> findByNameContainingIgnoreCase(String name);

    boolean existsByPhone(String phone);
}