package com.sed10.mln.study.service;

import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CurrentStudentResolver {
    private final JwtService jwtService;

    public Optional<Long> resolveFromAuthorization(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        String token = authorizationHeader.substring(7).trim();
        if (token.isEmpty() || !jwtService.isTokenValid(token)) {
            return Optional.empty();
        }

        try {
            return Optional.of(Long.valueOf(jwtService.extractUserId(token)));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    /**
     * Ưu tiên JWT; param studentId chỉ dùng khi không có token (dev / session cũ).
     * Nếu cả hai có mặt phải khớp nhau.
     */
    public Long resolveStudentId(String authorizationHeader, Long paramStudentId) {
        Optional<Long> fromToken = resolveFromAuthorization(authorizationHeader);

        if (fromToken.isPresent()) {
            if (paramStudentId != null && !paramStudentId.equals(fromToken.get())) {
                throw new AppException(ErrorCode.STUDENT_ACCESS_DENIED);
            }
            return fromToken.get();
        }

        return paramStudentId;
    }
}
