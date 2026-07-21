package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.request.PageViewRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.TrafficAnalyticsResponse;
import com.sed10.mln.study.security.CustomUserDetails;
import com.sed10.mln.study.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalyticsController {

    private static final int SUCCESS_CODE = 0;

    private final AnalyticsService analyticsService;

    @PostMapping("/analytics/page-views")
    public ResponseEntity<ApiResponse<Boolean>> recordPageView(
            @RequestBody PageViewRequest request,
            Authentication authentication
    ) {
        Long userId = extractUserId(authentication);
        analyticsService.recordPageView(request.getPath(), request.getViewerKey(), userId);

        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .code(SUCCESS_CODE)
                .message("Ghi nhan luot xem thanh cong")
                .result(true)
                .build());
    }

    @GetMapping("/admin/analytics/traffic")
    public ResponseEntity<ApiResponse<TrafficAnalyticsResponse>> getTraffic(
            @RequestParam(defaultValue = "14") int days
    ) {
        TrafficAnalyticsResponse result = analyticsService.getTrafficAnalytics(days);

        return ResponseEntity.ok(ApiResponse.<TrafficAnalyticsResponse>builder()
                .code(SUCCESS_CODE)
                .message("Lay thong ke luu luong thanh cong")
                .result(result)
                .build());
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            return null;
        }
        return details.getUser().getId();
    }
}
