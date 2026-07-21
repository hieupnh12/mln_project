export type TrafficDayPoint = {
  date: string;
  views: number;
};

export type TrafficPathStat = {
  path: string;
  views: number;
};

export type OnlineUserActivity = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  lastSeenAt: string | null;
  lastPath: string | null;
};

export type RecentPageView = {
  path: string;
  viewedAt: string | null;
  viewerLabel: string;
  role: string | null;
};

export type TrafficAnalytics = {
  totalViews: number;
  onlineUsers: number;
  viewsToday: number;
  viewsYesterday: number;
  uniqueViewers: number;
  dailyViews: TrafficDayPoint[];
  topPaths: TrafficPathStat[];
  onlineUserDetails: OnlineUserActivity[];
  recentViews: RecentPageView[];
};

export type BackendApiResponse<T> = {
  code: number;
  message?: string;
  result?: T;
};
