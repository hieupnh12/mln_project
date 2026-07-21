package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TrafficAnalyticsResponse {
    long totalViews;
    long onlineUsers;
    long viewsToday;
    long viewsYesterday;
    long uniqueViewers;
    List<TrafficDayResponse> dailyViews;
    List<TrafficPathStatResponse> topPaths;
    List<OnlineUserActivityResponse> onlineUserDetails;
    List<RecentPageViewResponse> recentViews;
}
