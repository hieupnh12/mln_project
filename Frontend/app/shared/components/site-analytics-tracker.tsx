import { usePageViewTracker } from "~/features/analytics/hooks/use-page-view-tracker";
import { usePresenceHeartbeat } from "~/features/analytics/hooks/use-presence-heartbeat";

export function SiteAnalyticsTracker() {
  usePageViewTracker();
  usePresenceHeartbeat();
  return null;
}
