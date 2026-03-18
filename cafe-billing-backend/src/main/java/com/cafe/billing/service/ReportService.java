package com.cafe.billing.service;

import com.cafe.billing.dto.DailyReportDTO;
import com.cafe.billing.dto.TopProductDTO;
import com.cafe.billing.model.Order;
import com.cafe.billing.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private OrderRepository orderRepository;

    public DailyReportDTO getDailyReport(LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end   = start.plusDays(1);

        List<Order> orders = orderRepository
                .findByCreatedAtBetween(start, end);

        Long   totalOrders  = (long) orders.size();
        Double totalRevenue = orderRepository
                .getTotalRevenueBetween(start, end);
        Double totalTax     = orderRepository
                .getTotalTaxBetween(start, end);

        totalRevenue = totalRevenue != null ? totalRevenue : 0.0;
        totalTax     = totalTax     != null ? totalTax     : 0.0;

        double avgValue = totalOrders > 0
                ? totalRevenue / totalOrders : 0.0;

        Map<String, Long> paymentBreakdown = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getPaymentMethod() != null
                                ? o.getPaymentMethod() : "UNKNOWN",
                        Collectors.counting()
                ));

        List<TopProductDTO> topProducts =
                orderRepository.getTopProducts(start, end);

        return new DailyReportDTO(
                date.toString(),
                totalOrders,
                totalRevenue,
                totalTax,
                Math.round(avgValue * 100.0) / 100.0,
                paymentBreakdown,
                topProducts
        );
    }

    public List<DailyReportDTO> getMonthlyReport(
            int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(
                start.lengthOfMonth());
        return start.datesUntil(end.plusDays(1))
                .map(this::getDailyReport)
                .filter(r -> r.getTotalOrders() > 0)
                .collect(Collectors.toList());
    }

    public List<TopProductDTO> getTopProducts() {
        LocalDateTime start = LocalDate.now()
                .minusDays(30).atStartOfDay();
        LocalDateTime end   = LocalDateTime.now();
        return orderRepository.getTopProducts(start, end);
    }

    public Map<String, Object> getRevenueSummary() {
        LocalDateTime todayStart = LocalDate.now()
                .atStartOfDay();
        LocalDateTime weekStart  = LocalDate.now()
                .minusDays(7).atStartOfDay();
        LocalDateTime monthStart = LocalDate.now()
                .withDayOfMonth(1).atStartOfDay();
        LocalDateTime now        = LocalDateTime.now();

        Double todayRevenue = orderRepository
                .getTotalRevenueBetween(todayStart, now);
        Double weekRevenue  = orderRepository
                .getTotalRevenueBetween(weekStart,  now);
        Double monthRevenue = orderRepository
                .getTotalRevenueBetween(monthStart, now);

        Long todayOrders = orderRepository
                .countOrdersBetween(todayStart, now);
        Long weekOrders  = orderRepository
                .countOrdersBetween(weekStart,  now);
        Long monthOrders = orderRepository
                .countOrdersBetween(monthStart, now);

        return Map.of(
                "todayRevenue",  todayRevenue  != null ? todayRevenue  : 0.0,
                "weekRevenue",   weekRevenue   != null ? weekRevenue   : 0.0,
                "monthRevenue",  monthRevenue  != null ? monthRevenue  : 0.0,
                "todayOrders",   todayOrders   != null ? todayOrders   : 0L,
                "weekOrders",    weekOrders    != null ? weekOrders    : 0L,
                "monthOrders",   monthOrders   != null ? monthOrders   : 0L
        );
    }
}