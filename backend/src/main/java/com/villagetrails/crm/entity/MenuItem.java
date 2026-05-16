package com.villagetrails.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(name = "is_veg", nullable = false)
    private boolean isVeg;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @Column(name = "preparation_time", nullable = false)
    private int preparationTime;

    @Column(name = "image_url")
    private String imageUrl;
}
