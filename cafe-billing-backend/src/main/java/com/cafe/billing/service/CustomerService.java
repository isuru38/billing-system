package com.cafe.billing.service;

import com.cafe.billing.model.Customer;
import com.cafe.billing.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + id));
    }

    public Customer getByPhone(String phone) {
        return customerRepository.findByPhone(phone)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with phone: " + phone));
    }

    public Customer create(Customer customer) {
        if (customer.getPhone() != null &&
                customerRepository.existsByPhone(customer.getPhone())) {
            throw new RuntimeException(
                    "Phone number already registered: " + customer.getPhone());
        }
        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null &&
                !updated.getPhone().equals(existing.getPhone()) &&
                customerRepository.existsByPhone(updated.getPhone())) {
            throw new RuntimeException(
                    "Phone already used by another customer");
        }
        existing.setPhone(updated.getPhone());
        return customerRepository.save(existing);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException(
                    "Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    public List<Customer> search(String keyword) {
        return customerRepository
                .findByNameContainingIgnoreCase(keyword);
    }

    public void updateSpent(Long customerId, BigDecimal amount) {
        Customer customer = getById(customerId);
        customer.setTotalSpent(
                customer.getTotalSpent().add(amount));
        customer.setLoyaltyPoints(
                customer.getLoyaltyPoints() + amount.intValue());
        customerRepository.save(customer);
    }
}