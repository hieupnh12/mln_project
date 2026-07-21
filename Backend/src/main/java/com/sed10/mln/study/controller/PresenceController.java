package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.security.CustomUserDetails;
import com.sed10.mln.study.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/presence")
@RequiredArgsConstructor
public class PresenceController {

    private static final int SUCCESS_CODE = 0;
    private static final int VALIDATION_CODE = 1001;

    private final UserService userService;

    @PostMapping("/heartbeat")
    public ResponseEntity<ApiResponse<Boolean>> heartbeat(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                    .code(VALIDATION_CODE)
                    .message("Chua dang nhap")
                    .build());
        }

        userService.touchLastSeen(details.getUser().getId());

        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .code(SUCCESS_CODE)
                .message("Cap nhat trang thai online thanh cong")
                .result(true)
                .build());
    }
}
