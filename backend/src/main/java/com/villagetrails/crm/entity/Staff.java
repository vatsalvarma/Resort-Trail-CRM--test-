package com.villagetrails.crm.entity;

import com.villagetrails.crm.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Staff extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String department;

    private String phone;

    private String shift;

    @Column(nullable = false)
    private boolean isActive = true;

    private java.math.BigDecimal salary;

    @Column(name = "join_date")
    private java.time.LocalDate joinDate;

    private String avatarUrl;
}
