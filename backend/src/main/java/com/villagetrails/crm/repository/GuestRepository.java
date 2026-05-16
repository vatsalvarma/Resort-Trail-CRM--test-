package com.villagetrails.crm.repository;

import com.villagetrails.crm.entity.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GuestRepository extends JpaRepository<Guest, UUID> {
    Optional<Guest> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT g FROM Guest g WHERE " +
           "LOWER(g.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(g.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "g.phone LIKE CONCAT('%', :q, '%')")
    Page<Guest> search(@Param("q") String query, Pageable pageable);
}
