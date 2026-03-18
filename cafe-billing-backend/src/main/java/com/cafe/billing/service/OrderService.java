package com.cafe.billing.service;

import com.cafe.billing.dto.OrderRequest;
import com.cafe.billing.model.*;
import com.cafe.billing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository    orderRepository;
    @Autowired private ProductRepository  productRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private CustomerService    customerService;
    @Autowired private InvoiceService     invoiceService;

    @Transactional
    public Order createOrder(OrderRequest request) {

        if (request.getItems() == null ||
                request.getItems().isEmpty()) {
            throw new RuntimeException(
                    "Order must have at least one item");
        }

        Order order = new Order();
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setStatus("COMPLETED");

        // Attach customer if provided
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository
                    .findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException(
                            "Customer not found: " +
                                    request.getCustomerId()));
            order.setCustomer(customer);
        }

        // Build items + calculate subtotal
        List<OrderItem> items    = new ArrayList<>();
        BigDecimal      subtotal = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {

            Product product = productRepository
                    .findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found: " +
                                    itemReq.getProductId()));

            if (Boolean.FALSE.equals(product.getIsAvailable())) {
                throw new RuntimeException(
                        "Product not available: " + product.getName());
            }

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: " +
                                product.getName());
            }

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(product.getPrice()
                    .multiply(BigDecimal.valueOf(
                            itemReq.getQuantity())));
            item.setOrder(order);
            items.add(item);

            subtotal = subtotal.add(item.getTotalPrice());

            // Reduce stock
            product.setStockQuantity(
                    product.getStockQuantity() -
                            itemReq.getQuantity());
            productRepository.save(product);
        }

        // Calculate totals
        BigDecimal tax      = subtotal.multiply(
                new BigDecimal("0.05"));
        BigDecimal discount = request.getDiscountAmount() != null
                ? request.getDiscountAmount()
                : BigDecimal.ZERO;
        BigDecimal total    = subtotal.add(tax).subtract(discount);

        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setTaxAmount(tax);
        order.setDiscountAmount(discount);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        // Auto generate invoice
        invoiceService.generateForOrder(saved);

        // Update customer loyalty points
        if (saved.getCustomer() != null) {
            customerService.updateSpent(
                    saved.getCustomer().getId(), total);
        }

        return saved;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Order not found: " + id));
    }

    public List<Order> getTodaysOrders() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return orderRepository
                .findByCreatedAtBetween(start, end);
    }

    public List<Order> getByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}