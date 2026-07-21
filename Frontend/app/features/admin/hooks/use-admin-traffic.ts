import { useQuery } from "@tanstack/react-query";

import {
  ANALYTICS_QUERY_KEYS,
  DEFAULT_TRAFFIC_DAYS,
} from "~/features/analytics/constants/analytics.constants";
import { getAdminTrafficAnalytics } from "~/features/analytics/services/analytics.service";

export function useAdminTrafficQuery(days = DEFAULT_TRAFFIC_DAYS) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.traffic(days),
    queryFn: () => getAdminTrafficAnalytics(days),
    refetchInterval: 30_000,
  });
}
