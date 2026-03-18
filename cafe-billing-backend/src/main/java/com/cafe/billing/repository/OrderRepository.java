package com.cafe.billing.repository;

import com.cafe.billing.model.Order;
import com.cafe.billing.dto.TopProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByCreatedAtBetween(
            LocalDateTime start, LocalDateTime end);

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByStatus(String status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
            "WHERE o.createdAt BETWEEN :start AND :end")
    Double getTotalRevenueBetween(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.createdAt BETWEEN :start AND :end")
    Long countOrdersBetween(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end);

    @Query("SELECT new com.cafe.billing.dto.TopProductDTO(" +
            "oi.product.name, SUM(oi.quantity), SUM(oi.totalPrice)) " +
            "FROM OrderItem oi " +
            "WHERE oi.order.createdAt BETWEEN :start AND :end " +
            "GROUP BY oi.product.name " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<TopProductDTO> getTopProducts(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end);

    @Query("SELECT SUM(o.taxAmount) FROM Order o " +
            "WHERE o.createdAt BETWEEN :start AND :end")
    Double getTotalTaxBetween(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end);
}