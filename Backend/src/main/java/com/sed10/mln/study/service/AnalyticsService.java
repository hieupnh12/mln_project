package com.sed10.mln.study.service;

import com.sed10.mln.study.dto.response.OnlineUserActivityResponse;
import com.sed10.mln.study.dto.response.RecentPageViewResponse;
import com.sed10.mln.study.dto.response.TrafficAnalyticsResponse;
import com.sed10.mln.study.dto.response.TrafficDayResponse;
import com.sed10.mln.study.dto.response.TrafficPathStatResponse;
import com.sed10.mln.study.entity.PageView;
import com.sed10.mln.study.repository.PageViewRepository;
import com.sed10.mln.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private static final int DEFAULT_ONLINE_MINUTES = 5;
    private static final int MAX_PATH_LENGTH = 500;
    private static final int TOP_PATHS_LIMIT = 10;
    private static final int RECENT_VIEWS_LIMIT = 25;

    private final PageViewRepository pageViewRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordPageView(String path, String viewerKey, Long userId) {
        String normalizedPath = normalizePath(path);
        if (normalizedPath.isBlank()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        PageView pageView = PageView.builder()
                .path(normalizedPath)
                .viewerKey(trimToNull(viewerKey, 64))
                .userId(userId)
                .viewedAt(now)
                .build();

        pageViewRepository.save(pageView);

        if (userId != null) {
            userRepository.updateLastSeenAt(userId, now);
        }
    }

    @Transactional(readOnly = true)
    public TrafficAnalyticsResponse getTrafficAnalytics(int days) {
        int safeDays = Math.min(Math.max(days, 1), 90);
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate fromDate = today.minusDays(safeDays - 1L);
        LocalDateTime fromDateTime = fromDate.atStartOfDay();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime yesterdayStart = yesterday.atStartOfDay();

        Map<LocalDate, Long> countsByDate = new HashMap<>();
        for (Object[] row : pageViewRepository.countDailyViewsSince(fromDateTime)) {
            LocalDate date = toLocalDate(row[0]);
            long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
            if (date != null) {
                countsByDate.put(date, count);
            }
        }

        List<TrafficDayResponse> dailyViews = new ArrayList<>();
        long totalViews = 0L;
        for (int offset = 0; offset < safeDays; offset++) {
            LocalDate date = fromDate.plusDays(offset);
            long views = countsByDate.getOrDefault(date, 0L);
            totalViews += views;
            dailyViews.add(TrafficDayResponse.builder()
                    .date(date.format(DATE_FORMAT))
                    .views(views)
                    .build());
        }

        long viewsToday = pageViewRepository.countByViewedAtAfter(todayStart);
        long viewsYesterday = pageViewRepository.countByViewedAtBetween(yesterdayStart, todayStart);
        long uniqueViewers = pageViewRepository.countUniqueViewersSince(fromDateTime);

        List<TrafficPathStatResponse> topPaths = new ArrayList<>();
        for (Object[] row : pageViewRepository.findTopPathsSince(fromDateTime, TOP_PATHS_LIMIT)) {
            topPaths.add(TrafficPathStatResponse.builder()
                    .path(row[0] == null ? "/" : String.valueOf(row[0]))
                    .views(row[1] == null ? 0L : ((Number) row[1]).longValue())
                    .build());
        }

        LocalDateTime onlineThreshold = LocalDateTime.now().minusMinutes(DEFAULT_ONLINE_MINUTES);
        List<OnlineUserActivityResponse> onlineUserDetails = new ArrayList<>();
        for (Object[] row : pageViewRepository.findOnlineUserActivities(onlineThreshold)) {
            onlineUserDetails.add(OnlineUserActivityResponse.builder()
                    .id(row[0] == null ? null : ((Number) row[0]).longValue())
                    .fullName(row[1] == null ? "Người dùng" : String.valueOf(row[1]))
                    .email(row[2] == null ? "" : String.valueOf(row[2]))
                    .role(row[3] == null ? "student" : String.valueOf(row[3]))
                    .lastSeenAt(formatDateTime(toLocalDateTime(row[4])))
                    .lastPath(row[5] == null ? null : String.valueOf(row[5]))
                    .build());
        }

        List<RecentPageViewResponse> recentViews = new ArrayList<>();
        for (Object[] row : pageViewRepository.findRecentViewsSince(fromDateTime, RECENT_VIEWS_LIMIT)) {
            String fullName = row[2] == null ? null : String.valueOf(row[2]);
            String email = row[3] == null ? null : String.valueOf(row[3]);
            String viewerLabel = fullName != null && !fullName.isBlank()
                    ? fullName
                    : (email != null && !email.isBlank() ? email : "Khách ẩn danh");

            recentViews.add(RecentPageViewResponse.builder()
                    .path(row[0] == null ? "/" : String.valueOf(row[0]))
                    .viewedAt(formatDateTime(toLocalDateTime(row[1])))
                    .viewerLabel(viewerLabel)
                    .role(row[4] == null ? null : String.valueOf(row[4]))
                    .build());
        }

        return TrafficAnalyticsResponse.builder()
                .totalViews(totalViews)
                .onlineUsers(onlineUserDetails.size())
                .viewsToday(viewsToday)
                .viewsYesterday(viewsYesterday)
                .uniqueViewers(uniqueViewers)
                .dailyViews(dailyViews)
                .topPaths(topPaths)
                .onlineUserDetails(onlineUserDetails)
                .recentViews(recentViews)
                .build();
    }

    private String normalizePath(String path) {
        if (path == null) {
            return "";
        }
        String trimmed = path.trim();
        if (trimmed.isEmpty()) {
            return "";
        }
        if (!trimmed.startsWith("/")) {
            trimmed = "/" + trimmed;
        }
        if (trimmed.length() > MAX_PATH_LENGTH) {
            return trimmed.substring(0, MAX_PATH_LENGTH);
        }
        return trimmed;
    }

    private String trimToNull(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.length() > maxLength ? trimmed.substring(0, maxLength) : trimmed;
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        if (value instanceof java.util.Date utilDate) {
            return new Date(utilDate.getTime()).toLocalDate();
        }
        if (value instanceof String text) {
            return LocalDate.parse(text);
        }
        return null;
    }

    private LocalDateTime toLocalDateTime(Object value) {
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate().atStartOfDay();
        }
        if (value instanceof java.util.Date utilDate) {
            return new Timestamp(utilDate.getTime()).toLocalDateTime();
        }
        if (value instanceof String text && !text.isBlank()) {
            return LocalDateTime.parse(text.replace(" ", "T"));
        }
        return null;
    }

    private String formatDateTime(LocalDateTime value) {
        return value == null ? null : value.format(DATE_TIME_FORMAT);
    }
}
