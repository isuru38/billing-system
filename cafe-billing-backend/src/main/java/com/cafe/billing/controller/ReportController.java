package com.cafe.billing.controller;

import com.cafe.billing.dto.DailyReportDTO;
import com.cafe.billing.dto.TopProductDTO;
import com.cafe.billing.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<DailyReportDTO> getDaily(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(
                reportService.getDailyReport(date));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<DailyReportDTO>> getMonthly(
            @RequestParam(defaultValue = "0") int year,
            @RequestParam(defaultValue = "0") int month) {
        if (year  == 0) year  = LocalDate.now().getYear();
        if (month == 0) month = LocalDate.now().getMonthValue();
        return ResponseEntity.ok(
                reportService.getMonthlyReport(year, month));
    }

    @GetMapping("/top-products")
    public List<TopProductDTO> getTopProducts() {
        return reportService.getTopProducts();
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue() {
        return ResponseEntity.ok(
                reportService.getRevenueSummary());
    }
}