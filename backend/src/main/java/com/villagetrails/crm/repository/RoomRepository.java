package com.villagetrails.crm.repository;

import com.villagetrails.crm.entity.Room;
import com.villagetrails.crm.entity.enums.RoomCategory;
import com.villagetrails.crm.entity.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByRoomNumber(String roomNumber);
    boolean existsByRoomNumber(String roomNumber);
    List<Room> findByStatus(RoomStatus status);
    List<Room> findByCategory(RoomCategory category);
    List<Room> findByStatusAndCategory(RoomStatus status, RoomCategory category);

    @Query("SELECT COUNT(r) FROM Room r WHERE r.status = :status")
    long countByStatus(@Param("status") RoomStatus status);
}
