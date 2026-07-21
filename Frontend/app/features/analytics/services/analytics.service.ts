import {
  fetchAdminTraffic,
  postPageView,
  postPresenceHeartbeat,
} from "../api/analytics.api";
import { PAGE_VIEW_VIEWER_KEY_STORAGE } from "../constants/analytics.constants";

function createViewerKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `viewer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateViewerKey() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(PAGE_VIEW_VIEWER_KEY_STORAGE);
  if (existing) {
    return existing;
  }

  const next = createViewerKey();
  window.localStorage.setItem(PAGE_VIEW_VIEWER_KEY_STORAGE, next);
  return next;
}

export function recordPageView(path: string) {
  return postPageView(path, getOrCreateViewerKey());
}

export function sendPresenceHeartbeat() {
  return postPresenceHeartbeat();
}

export function getAdminTrafficAnalytics(days: number) {
  return fetchAdminTraffic(days);
}
