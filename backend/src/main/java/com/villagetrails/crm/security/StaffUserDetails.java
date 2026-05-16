package com.villagetrails.crm.security;

import com.villagetrails.crm.entity.Staff;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
public class StaffUserDetails implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String role;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public StaffUserDetails(Staff staff) {
        this.id       = staff.getId();
        this.email    = staff.getEmail();
        this.password = staff.getPasswordHash();
        this.role     = staff.getRole().name();
        this.active   = staff.isActive();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + staff.getRole().name()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return active; }
}
