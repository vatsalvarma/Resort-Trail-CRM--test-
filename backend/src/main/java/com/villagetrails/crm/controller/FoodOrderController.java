package com.villagetrails.crm.controller;

import com.villagetrails.crm.entity.FoodOrder;
import com.villagetrails.crm.entity.enums.OrderStatus;
import com.villagetrails.crm.service.FoodOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class FoodOrderController {

    private final FoodOrderService orderService;

    @GetMapping
    public ResponseEntity<List<FoodOrder>> getAll(
            @RequestParam(required = false) OrderStatus status) {
        if (status != null) return ResponseEntity.ok(orderService.findByStatus(status));
        return ResponseEntity.ok(orderService.findActiveOrders());
    }

    @GetMapping("/active")
    public ResponseEntity<List<FoodOrder>> getActive() {
        return ResponseEntity.ok(orderService.findActiveOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<FoodOrder> place(@RequestBody FoodOrder order) {
        return ResponseEntity.ok(orderService.place(order));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','KITCHEN_HEAD')")
    public ResponseEntity<FoodOrder> updateStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<FoodOrder> cancel(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.cancel(id));
    }
}
