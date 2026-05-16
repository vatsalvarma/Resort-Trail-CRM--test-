package com.villagetrails.crm.repository;

import com.villagetrails.crm.entity.FoodOrder;
import com.villagetrails.crm.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FoodOrderRepository extends JpaRepository<FoodOrder, UUID> {
    Optional<FoodOrder> findByOrderNumber(String orderNumber);
    List<FoodOrder> findByStatus(OrderStatus status);
    List<FoodOrder> findByStatusIn(List<OrderStatus> statuses);
    Page<FoodOrder> findByGuestId(UUID guestId, Pageable pageable);

    @Query("SELECT COUNT(o) FROM FoodOrder o WHERE o.status = :status")
    long countByStatus(@Param("status") OrderStatus status);
}
