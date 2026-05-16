package com.villagetrails.crm.controller;

import com.villagetrails.crm.dto.common.PageResponse;
import com.villagetrails.crm.entity.Booking;
import com.villagetrails.crm.entity.enums.BookingStatus;
import com.villagetrails.crm.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<PageResponse<Booking>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false)    String q) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(PageResponse.of(bookingService.search(q, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    @GetMapping("/today/checkins")
    public ResponseEntity<List<Booking>> checkInsToday() {
        return ResponseEntity.ok(bookingService.findCheckInsToday());
    }

    @GetMapping("/today/checkouts")
    public ResponseEntity<List<Booking>> checkOutsToday() {
        return ResponseEntity.ok(bookingService.findCheckOutsToday());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.save(booking));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Booking> update(@PathVariable UUID id, @RequestBody Booking booking) {
        booking.setId(id);
        return ResponseEntity.ok(bookingService.save(booking));
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Booking> checkIn(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Booking> checkOut(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Booking> cancel(@PathVariable UUID id,
                                          @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.cancel(id, body.get("reason")));
    }
}
