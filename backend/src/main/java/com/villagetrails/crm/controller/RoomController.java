package com.villagetrails.crm.controller;

import com.villagetrails.crm.entity.Room;
import com.villagetrails.crm.entity.enums.RoomCategory;
import com.villagetrails.crm.entity.enums.RoomStatus;
import com.villagetrails.crm.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<Room>> getAll(
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) RoomCategory category) {
        if (status != null && category != null) {
            return ResponseEntity.ok(roomService.findAll().stream()
                .filter(r -> r.getStatus() == status && r.getCategory() == category)
                .toList());
        }
        if (status != null) return ResponseEntity.ok(roomService.findByStatus(status));
        if (category != null) return ResponseEntity.ok(roomService.findByCategory(category));
        return ResponseEntity.ok(roomService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(roomService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<Room> create(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.save(room));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<Room> update(@PathVariable UUID id, @RequestBody Room room) {
        room.setId(id);
        return ResponseEntity.ok(roomService.save(room));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','HOUSEKEEPING')")
    public ResponseEntity<Room> updateStatus(
            @PathVariable UUID id,
            @RequestParam RoomStatus status) {
        return ResponseEntity.ok(roomService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
