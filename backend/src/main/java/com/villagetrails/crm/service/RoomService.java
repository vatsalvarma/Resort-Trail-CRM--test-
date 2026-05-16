package com.villagetrails.crm.service;

import com.villagetrails.crm.entity.Room;
import com.villagetrails.crm.entity.enums.RoomCategory;
import com.villagetrails.crm.entity.enums.RoomStatus;
import com.villagetrails.crm.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public Room findById(UUID id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Room not found: " + id));
    }

    public Room findByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber)
            .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomNumber));
    }

    public List<Room> findByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status);
    }

    public List<Room> findByCategory(RoomCategory category) {
        return roomRepository.findByCategory(category);
    }

    @Transactional
    public Room save(Room room) {
        if (room.getId() == null && roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new IllegalArgumentException("Room number already exists: " + room.getRoomNumber());
        }
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateStatus(UUID id, RoomStatus status) {
        Room room = findById(id);
        room.setStatus(status);
        return roomRepository.save(room);
    }

    @Transactional
    public void delete(UUID id) {
        roomRepository.deleteById(id);
    }
}
