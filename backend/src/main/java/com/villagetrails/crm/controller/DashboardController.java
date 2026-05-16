package com.villagetrails.crm.controller;

import com.villagetrails.crm.entity.enums.BookingStatus;
import com.villagetrails.crm.entity.enums.OrderStatus;
import com.villagetrails.crm.entity.enums.RoomStatus;
import com.villagetrails.crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final RoomRepository       roomRepository;
    private final BookingRepository    bookingRepository;
    private final FoodOrderRepository  orderRepository;
    private final InvoiceRepository    invoiceRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalRooms    = roomRepository.count();
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;

        long totalBookings   = bookingRepository.count();
        long checkInsToday   = bookingRepository.countCheckInsByDate(BookingStatus.CONFIRMED, LocalDate.now());
        long checkOutsToday  = bookingRepository.countCheckInsByDate(BookingStatus.CHECKED_IN,  LocalDate.now());
        long activeOrders    = orderRepository.countByStatus(OrderStatus.PENDING)
                             + orderRepository.countByStatus(OrderStatus.ACCEPTED)
                             + orderRepository.countByStatus(OrderStatus.PREPARING);

        var totalRevenue  = invoiceRepository.totalCollected();
        var pendingAmount = invoiceRepository.totalPending();

        return ResponseEntity.ok(Map.of(
            "totalRevenue",    totalRevenue,
            "revenueChange",   0,
            "totalBookings",   totalBookings,
            "bookingsChange",  0,
            "occupancyRate",   Math.round(occupancyRate),
            "occupancyChange", 0,
            "pendingActions",  checkInsToday + checkOutsToday,
            "checkInsToday",   checkInsToday,
            "checkOutsToday",  checkOutsToday,
            "activeOrders",    activeOrders
        ));
    }
}
