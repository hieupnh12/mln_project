package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.GoogleLoginUrlResponse;
import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.service.GoogleOAuthService;
import com.sed10.mln.study.service.GoogleUserInfo;
import com.sed10.mln.study.service.JwtService;
import com.sed10.mln.study.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final GoogleOAuthService googleOAuthService;
    private final UserService userService;
    private final JwtService jwtService;
    
    @Value("${frontend.base-url}")
    private String frontendBaseUrl;
    
    @GetMapping("/google/url")
    public ResponseEntity<ApiResponse<GoogleLoginUrlResponse>> getGoogleLoginUrl() {
        try {
            String redirectUrl = googleOAuthService.getGoogleLoginUrl();
            
            return ResponseEntity.ok(ApiResponse.<GoogleLoginUrlResponse>builder()
                    .code(0)
                    .message("Google login URL retrieved successfully")
                    .result(GoogleLoginUrlResponse.builder()
                            .redirectUrl(redirectUrl)
                            .build())
                    .build());
        } catch (Exception e) {
            log.error("Error generating Google login URL: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.<GoogleLoginUrlResponse>builder()
                    .code(1001)
                    .message("Failed to generate Google login URL")
                    .build());
        }
    }
    
    @GetMapping("/google/callback")
    public ResponseEntity<?> handleGoogleCallback(
            @RequestParam String code) {
        try {
            log.info("Handling Google OAuth callback with code: {}", code);
            
            // Exchange code for token and get user info
            GoogleUserInfo userInfo = googleOAuthService.exchangeCodeForToken(code);
            log.info("Received user info: {}", userInfo.getEmail());
            
            // Find or create user (role will be determined by email or defaulted to "student")
            User user = userService.findOrCreateUserByGoogle(
                    userInfo.getGoogleId(),
                    userInfo.getEmail(),
                    userInfo.getName()
            );
            
            // Generate JWT token
            String token = jwtService.generateToken(
                    String.valueOf(user.getId()),
                    user.getEmail(),
                    user.getRole()
            );
            
            log.info("Generated JWT token for user: {} with role: {}", user.getEmail(), user.getRole());
            String displayName = user.getFullName() == null || user.getFullName().isBlank()
                    ? userInfo.getName()
                    : user.getFullName();
            
            // Redirect to frontend with token and role
            String frontendRedirectUrl = String.format(
                    "%s?token=%s&role=%s&userId=%d&name=%s&email=%s&avatarUrl=%s",
                    buildFrontendUrl("/auth/callback"),
                    encodeQueryValue(token),
                    encodeQueryValue(user.getRole()),
                    user.getId(),
                    encodeQueryValue(displayName),
                    encodeQueryValue(user.getEmail()),
                    encodeQueryValue(userInfo.getPicture())
            );
            
            return ResponseEntity.status(302)
                    .header("Location", frontendRedirectUrl)
                    .build();
            
        } catch (Exception e) {
            log.error("Error handling Google callback: {}", e.getMessage(), e);
            return ResponseEntity.status(302)
                    .header("Location", buildFrontendUrl("/login?error=oauth_failed"))
                    .build();
        }
    }

    private String buildFrontendUrl(String path) {
        return frontendBaseUrl.replaceAll("/+$", "") + path;
    }

    private String encodeQueryValue(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
    
    @PostMapping("/validate-token")
    public ResponseEntity<ApiResponse<Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(ApiResponse.builder()
                        .code(1001)
                        .message("Invalid authorization header")
                        .build());
            }
            
            String token = authHeader.substring(7);
            boolean isValid = jwtService.isTokenValid(token);
            
            if (!isValid) {
                return ResponseEntity.ok(ApiResponse.builder()
                        .code(1001)
                        .message("Token is invalid or expired")
                        .build());
            }
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(0)
                    .message("Token is valid")
                    .result(true)
                    .build());
            
        } catch (Exception e) {
            log.error("Error validating token: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(1001)
                    .message("Token validation failed")
                    .build());
        }
    }
}
