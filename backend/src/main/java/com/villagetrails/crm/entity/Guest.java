package com.villagetrails.crm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "guests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Guest extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String address;

    @Column(name = "id_type")
    private String idType;

    @Column(name = "id_number")
    private String idNumber;

    private String nationality;

    @Column(name = "total_bookings", nullable = false)
    private int totalBookings = 0;

    @Column(name = "total_spent", nullable = false, precision = 12, scale = 2)
    private java.math.BigDecimal totalSpent = java.math.BigDecimal.ZERO;

    @Column(name = "last_visit")
    private java.time.LocalDate lastVisit;
}
