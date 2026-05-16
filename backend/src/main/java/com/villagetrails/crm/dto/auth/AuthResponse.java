package com.villagetrails.crm.dto.auth;

import java.util.UUID;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UUID   staffId,
    String name,
    String email,
    String role
) {}
