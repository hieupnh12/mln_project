export const ANALYTICS_ENDPOINTS = {
  pageViews: "/analytics/page-views",
  presenceHeartbeat: "/presence/heartbeat",
  adminTraffic: "/admin/analytics/traffic",
} as const;

export const ANALYTICS_QUERY_KEYS = {
  traffic: (days: number) => ["admin", "analytics", "traffic", days] as const,
};

export const DEFAULT_TRAFFIC_DAYS = 14;
export const TRAFFIC_DAY_OPTIONS = [7, 14, 30] as const;
export const PRESENCE_HEARTBEAT_INTERVAL_MS = 60_000;
export const PAGE_VIEW_VIEWER_KEY_STORAGE = "mln_viewer_key";
export const ONLINE_THRESHOLD_MINUTES = 5;
