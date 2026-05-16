package com.villagetrails.crm.service;

import com.villagetrails.crm.dto.auth.AuthResponse;
import com.villagetrails.crm.dto.auth.LoginRequest;
import com.villagetrails.crm.dto.auth.RefreshRequest;
import com.villagetrails.crm.entity.Staff;
import com.villagetrails.crm.repository.StaffRepository;
import com.villagetrails.crm.security.JwtTokenProvider;
import com.villagetrails.crm.security.StaffUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final StaffRepository staffRepository;

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        StaffUserDetails principal = (StaffUserDetails) auth.getPrincipal();
        Staff staff = staffRepository.findByEmail(principal.getEmail())
            .orElseThrow();

        String accessToken  = tokenProvider.generateToken(auth);
        String refreshToken = tokenProvider.generateRefreshToken(staff.getEmail());

        return new AuthResponse(
            accessToken, refreshToken,
            staff.getId(), staff.getName(), staff.getEmail(), staff.getRole().name()
        );
    }

    public AuthResponse refresh(RefreshRequest request) {
        String token = request.refreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String email = tokenProvider.getEmailFromToken(token);
        Staff staff  = staffRepository.findByEmail(email).orElseThrow();

        String newAccess  = tokenProvider.generateRefreshToken(email);
        String newRefresh = tokenProvider.generateRefreshToken(email);

        return new AuthResponse(
            newAccess, newRefresh,
            staff.getId(), staff.getName(), staff.getEmail(), staff.getRole().name()
        );
    }
}
