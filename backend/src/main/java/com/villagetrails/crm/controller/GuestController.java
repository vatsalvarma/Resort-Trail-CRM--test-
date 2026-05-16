package com.villagetrails.crm.controller;

import com.villagetrails.crm.dto.common.PageResponse;
import com.villagetrails.crm.entity.Guest;
import com.villagetrails.crm.repository.GuestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestRepository guestRepository;

    @GetMapping
    public ResponseEntity<PageResponse<Guest>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false)    String q) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        if (StringUtils.hasText(q)) {
            return ResponseEntity.ok(PageResponse.of(guestRepository.search(q, pageable)));
        }
        return ResponseEntity.ok(PageResponse.of(guestRepository.findAll(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(guestRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Guest not found: " + id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Guest> create(@RequestBody Guest guest) {
        return ResponseEntity.ok(guestRepository.save(guest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER','RECEPTION')")
    public ResponseEntity<Guest> update(@PathVariable UUID id, @RequestBody Guest guest) {
        guest.setId(id);
        return ResponseEntity.ok(guestRepository.save(guest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        guestRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
