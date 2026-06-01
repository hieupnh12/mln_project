package com.sed10.mln.study.service;

import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    @Value("${admin.email:}")
    private String adminEmail;

    private static final String DEFAULT_ROLE = "student";

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return DEFAULT_ROLE;
        }

        String normalizedRole = role.trim().toLowerCase();
        if ("student".equals(normalizedRole) || "teacher".equals(normalizedRole) || "admin".equals(normalizedRole)) {
            return normalizedRole;
        }

        return DEFAULT_ROLE;
    }

    private String resolveRoleByEmail(String email, String currentRole) {
        if (!normalizeEmail(email).isBlank() && normalizeEmail(email).equals(normalizeEmail(adminEmail))) {
            return "admin";
        }

        return normalizeRole(currentRole);
    }
    
    public User findOrCreateUserByGoogle(String googleId, String email, String name) {
        // Try to find by googleId first
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setRole(resolveRoleByEmail(user.getEmail(), user.getRole()));
            return userRepository.save(user);
        }
        
        // Try to find by email
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            User user = userByEmail.get();
            user.setGoogleId(googleId);
            user.setRole(resolveRoleByEmail(user.getEmail(), user.getRole()));
            return userRepository.save(user);
        }
        
        // Create new user - default role is student unless the email is configured as admin
        String role = resolveRoleByEmail(email, DEFAULT_ROLE);
        
        User newUser = User.builder()
                .googleId(googleId)
                .email(email)
                .fullName(name)
                .username(email.split("@")[0]) // username from email
                .role(role)
                .isActive(true)
                .build();
        
        log.info("Creating new user with role: {} for email: {}", role, email);
        return userRepository.save(newUser);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User userData) {
        String normalizedEmail = normalizeEmail(userData.getEmail());
        if (normalizedEmail.isBlank()) {
            throw new IllegalArgumentException("Email khong hop le");
        }

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email da ton tai");
        }

        userData.setEmail(normalizedEmail);
        userData.setRole(resolveRoleByEmail(normalizedEmail, userData.getRole()));
        userData.setUsername(resolveUsername(normalizedEmail));
        userData.setIsActive(userData.getIsActive() == null ? Boolean.TRUE : userData.getIsActive());

        return userRepository.save(userData);
    }

    public User updateUser(Long id, User userData) {
        Optional<User> existingUserOptional = userRepository.findById(id);
        if (existingUserOptional.isEmpty()) {
            return null;
        }

        User existingUser = existingUserOptional.get();
        String normalizedEmail = normalizeEmail(userData.getEmail());

        if (normalizedEmail.isBlank()) {
            throw new IllegalArgumentException("Email khong hop le");
        }

        Optional<User> userByEmail = userRepository.findByEmail(normalizedEmail);
        if (userByEmail.isPresent() && !userByEmail.get().getId().equals(id)) {
            throw new IllegalArgumentException("Email da ton tai");
        }

        existingUser.setEmail(normalizedEmail);
        existingUser.setFullName(userData.getFullName());
        existingUser.setRole(resolveRoleByEmail(normalizedEmail, userData.getRole()));
        existingUser.setUsername(resolveUsername(normalizedEmail));
        existingUser.setIsActive(userData.getIsActive() == null ? existingUser.getIsActive() : userData.getIsActive());

        return userRepository.save(existingUser);
    }

    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }

        userRepository.deleteById(id);
        return true;
    }

    private String resolveUsername(String email) {
        if (email.contains("@")) {
            return email.split("@")[0];
        }

        return email;
    }
}
