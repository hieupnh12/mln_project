package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.request.UserUpsertRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.UserAdminResponse;
import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private static final int SUCCESS_CODE = 0;
    private static final int VALIDATION_CODE = 1001;

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserAdminResponse>>> getUsers() {
        List<UserAdminResponse> users = userService.getAllUsers().stream()
                .sorted(Comparator.comparing(User::getId).reversed())
                .map(this::toUserAdminResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.<List<UserAdminResponse>>builder()
                .code(SUCCESS_CODE)
                .message("Lay danh sach nguoi dung thanh cong")
                .result(users)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserAdminResponse>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                    .code(VALIDATION_CODE)
                    .message("Nguoi dung khong ton tai")
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                .code(SUCCESS_CODE)
                .message("Lay nguoi dung thanh cong")
                .result(toUserAdminResponse(user))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserAdminResponse>> createUser(@RequestBody UserUpsertRequest request) {
        try {
            User createdUser = userService.createUser(toUserEntity(request));

            return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                    .code(SUCCESS_CODE)
                    .message("Tao nguoi dung thanh cong")
                    .result(toUserAdminResponse(createdUser))
                    .build());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                    .code(VALIDATION_CODE)
                    .message(ex.getMessage())
                    .build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserAdminResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpsertRequest request
    ) {
        try {
            User updatedUser = userService.updateUser(id, toUserEntity(request));
            if (updatedUser == null) {
                return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                        .code(VALIDATION_CODE)
                        .message("Nguoi dung khong ton tai")
                        .build());
            }

            return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                    .code(SUCCESS_CODE)
                    .message("Cap nhat nguoi dung thanh cong")
                    .result(toUserAdminResponse(updatedUser))
                    .build());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.ok(ApiResponse.<UserAdminResponse>builder()
                    .code(VALIDATION_CODE)
                    .message(ex.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .code(VALIDATION_CODE)
                    .message("Nguoi dung khong ton tai")
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.builder()
                .code(SUCCESS_CODE)
                .message("Xoa nguoi dung thanh cong")
                .result(true)
                .build());
    }

    private User toUserEntity(UserUpsertRequest request) {
        return User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(request.getRole())
                .isActive(request.getIsActive())
                .build();
    }

    private UserAdminResponse toUserAdminResponse(User user) {
        return UserAdminResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .googleId(user.getGoogleId())
                .build();
    }
}