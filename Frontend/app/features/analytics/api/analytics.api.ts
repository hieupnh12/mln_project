import { apiClient } from "~/shared/services/api-client";

import { ANALYTICS_ENDPOINTS } from "../constants/analytics.constants";
import type { BackendApiResponse, TrafficAnalytics } from "../types/analytics.types";

function assertSuccess<T>(response: BackendApiResponse<T>, fallback: string): T {
  if (response.code !== 0 || response.result === undefined) {
    throw new Error(response.message ?? fallback);
  }
  return response.result;
}

export async function postPageView(path: string, viewerKey: string) {
  await apiClient.post<BackendApiResponse<boolean>>(ANALYTICS_ENDPOINTS.pageViews, {
    path,
    viewerKey,
  });
}

export async function postPresenceHeartbeat() {
  await apiClient.post<BackendApiResponse<boolean>>(ANALYTICS_ENDPOINTS.presenceHeartbeat);
}

export async function fetchAdminTraffic(days: number) {
  const response = await apiClient.get<BackendApiResponse<TrafficAnalytics>>(
    ANALYTICS_ENDPOINTS.adminTraffic,
    { params: { days } },
  );
  const result = assertSuccess(response.data, "Không thể tải thống kê lưu lượng.");

  return {
    totalViews: result.totalViews ?? 0,
    onlineUsers: result.onlineUsers ?? 0,
    viewsToday: result.viewsToday ?? 0,
    viewsYesterday: result.viewsYesterday ?? 0,
    uniqueViewers: result.uniqueViewers ?? 0,
    dailyViews: result.dailyViews ?? [],
    topPaths: result.topPaths ?? [],
    onlineUserDetails: result.onlineUserDetails ?? [],
    recentViews: result.recentViews ?? [],
  };
}
