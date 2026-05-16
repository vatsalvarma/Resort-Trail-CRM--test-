package com.villagetrails.crm.repository;

import com.villagetrails.crm.entity.Invoice;
import com.villagetrails.crm.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    Page<Invoice> findByPaymentStatus(PaymentStatus status, Pageable pageable);
    Page<Invoice> findByGuestId(UUID guestId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.grandTotal), 0) FROM Invoice i WHERE i.paymentStatus = 'PAID'")
    BigDecimal totalCollected();

    @Query("SELECT COALESCE(SUM(i.grandTotal), 0) FROM Invoice i WHERE i.paymentStatus = 'PENDING'")
    BigDecimal totalPending();

    @Query("SELECT COALESCE(SUM(i.grandTotal), 0) FROM Invoice i WHERE i.issuedAt BETWEEN :from AND :to")
    BigDecimal revenueInRange(@Param("from") Instant from, @Param("to") Instant to);
}
