package com.villagetrails.crm.service;

import com.villagetrails.crm.entity.Booking;
import com.villagetrails.crm.entity.enums.BookingStatus;
import com.villagetrails.crm.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;

    public Page<Booking> findAll(Pageable pageable) {
        return bookingRepository.findAll(pageable);
    }

    public Page<Booking> search(String query, Pageable pageable) {
        if (StringUtils.hasText(query)) {
            return bookingRepository.search(query, pageable);
        }
        return bookingRepository.findAll(pageable);
    }

    public Booking findById(UUID id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
    }

    public List<Booking> findCheckInsToday() {
        return bookingRepository.findByCheckIn(LocalDate.now());
    }

    public List<Booking> findCheckOutsToday() {
        return bookingRepository.findByCheckOut(LocalDate.now());
    }

    @Transactional
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateStatus(UUID id, BookingStatus status) {
        Booking booking = findById(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking checkIn(UUID id) {
        return updateStatus(id, BookingStatus.CHECKED_IN);
    }

    @Transactional
    public Booking checkOut(UUID id) {
        return updateStatus(id, BookingStatus.CHECKED_OUT);
    }

    @Transactional
    public Booking cancel(UUID id, String reason) {
        Booking booking = findById(id);
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        return bookingRepository.save(booking);
    }
}
