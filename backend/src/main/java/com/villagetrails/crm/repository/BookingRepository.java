package com.villagetrails.crm.repository;

import com.villagetrails.crm.entity.Booking;
import com.villagetrails.crm.entity.enums.BookingStatus;
import com.villagetrails.crm.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Optional<Booking> findByBookingNumber(String bookingNumber);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    List<Booking> findByCheckIn(LocalDate checkIn);
    List<Booking> findByCheckOut(LocalDate checkOut);

    @Query("SELECT b FROM Booking b WHERE b.guest.id = :guestId ORDER BY b.createdAt DESC")
    List<Booking> findByGuestId(@Param("guestId") UUID guestId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status NOT IN ('CANCELLED', 'CHECKED_OUT')")
    List<Booking> findActiveByRoomId(@Param("roomId") UUID roomId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.checkIn = :date")
    long countCheckInsByDate(@Param("status") BookingStatus status, @Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE " +
           "LOWER(b.bookingNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(b.guest.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Booking> search(@Param("q") String query, Pageable pageable);
}
