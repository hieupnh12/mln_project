import { useState } from "react";

import {
  DEFAULT_TRAFFIC_DAYS,
  ONLINE_THRESHOLD_MINUTES,
  TRAFFIC_DAY_OPTIONS,
} from "~/features/analytics/constants/analytics.constants";

import { AdminOnlineUsersPanel } from "../components/admin-online-users-panel";
import { AdminTrafficChart } from "../components/admin-traffic-chart";
import { AdminTrafficDetailsPanels } from "../components/admin-traffic-details-panels";
import { useAdminTrafficQuery } from "../hooks/use-admin-traffic";

export function AdminTrafficPage() {
  const [days, setDays] = useState<number>(DEFAULT_TRAFFIC_DAYS);
  const trafficQuery = useAdminTrafficQuery(days);
  const data = trafficQuery.data;

  const summaryCards = [
    { label: "Tổng lượt xem", value: data?.totalViews },
    { label: "Hôm nay", value: data?.viewsToday },
    { label: "Hôm qua", value: data?.viewsYesterday },
    { label: "Người xem unique", value: data?.uniqueViewers },
    { label: "Đang online", value: data?.onlineUsers },
  ];

  return (
    <div className="flex w-full flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between md:p-5">
        <div>
          <h1 className="text-headline-md font-semibold text-primary">
            Lưu lượng người xem website
          </h1>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Theo dõi lượt xem, trang phổ biến và người dùng đang hoạt động (online trong{" "}
            {ONLINE_THRESHOLD_MINUTES} phút).
          </p>
        </div>
        <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
          Khoảng thời gian
          <select
            className="min-h-10 rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
            onChange={(event) => setDays(Number(event.target.value))}
            value={days}
          >
            {TRAFFIC_DAY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} ngày
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <div
            className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-sm md:p-4"
            key={card.label}
          >
            <p className="text-label-sm text-on-surface-variant">{card.label}</p>
            <p className="mt-1 text-headline-md font-bold text-primary">
              {trafficQuery.isLoading ? "…" : (card.value ?? "—")}
            </p>
          </div>
        ))}
      </div>

      <AdminTrafficChart
        data={data}
        days={days}
        errorMessage={
          trafficQuery.error instanceof Error
            ? trafficQuery.error.message
            : undefined
        }
        isError={trafficQuery.isError}
        isLoading={trafficQuery.isLoading}
      />

      <AdminOnlineUsersPanel
        isLoading={trafficQuery.isLoading}
        users={data?.onlineUserDetails ?? []}
      />

      <AdminTrafficDetailsPanels
        isLoading={trafficQuery.isLoading}
        recentViews={data?.recentViews ?? []}
        topPaths={data?.topPaths ?? []}
      />
    </div>
  );
}
