package com.villagetrails.crm.controller;

import com.villagetrails.crm.entity.Staff;
import com.villagetrails.crm.repository.StaffRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
public class StaffController {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Staff>> getAll() {
        return ResponseEntity.ok(staffRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(staffRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Staff not found: " + id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Staff> create(@RequestBody Staff staff) {
        staff.setPasswordHash(passwordEncoder.encode(staff.getPasswordHash()));
        return ResponseEntity.ok(staffRepository.save(staff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable UUID id, @RequestBody Staff staff) {
        staff.setId(id);
        return ResponseEntity.ok(staffRepository.save(staff));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        staffRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
