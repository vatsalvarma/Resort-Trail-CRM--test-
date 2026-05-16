package com.villagetrails.crm.service;

import com.villagetrails.crm.entity.FoodOrder;
import com.villagetrails.crm.entity.enums.OrderStatus;
import com.villagetrails.crm.repository.FoodOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodOrderService {

    private final FoodOrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<FoodOrder> findActiveOrders() {
        return orderRepository.findByStatusIn(List.of(
            OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY
        ));
    }

    public List<FoodOrder> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public FoodOrder findById(UUID id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    @Transactional
    public FoodOrder place(FoodOrder order) {
        order.setPlacedAt(Instant.now());
        FoodOrder saved = orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/kitchen", saved);
        return saved;
    }

    @Transactional
    public FoodOrder updateStatus(UUID id, OrderStatus status) {
        FoodOrder order = findById(id);
        order.setStatus(status);
        switch (status) {
            case ACCEPTED  -> order.setAcceptedAt(Instant.now());
            case PREPARING -> {}
            case READY     -> order.setPreparedAt(Instant.now());
            case DELIVERED -> order.setDeliveredAt(Instant.now());
            default -> {}
        }
        FoodOrder saved = orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/kitchen", saved);
        return saved;
    }

    @Transactional
    public FoodOrder cancel(UUID id) {
        return updateStatus(id, OrderStatus.CANCELLED);
    }
}
