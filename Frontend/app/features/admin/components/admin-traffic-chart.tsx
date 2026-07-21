import type { TrafficAnalytics } from "~/features/analytics/types/analytics.types";

import { formatChartDayLabel } from "../utils/format-admin-datetime";

type AdminTrafficChartProps = {
  data: TrafficAnalytics | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  days: number;
};

export function AdminTrafficChart({
  data,
  isLoading,
  isError,
  errorMessage,
  days,
}: AdminTrafficChartProps) {
  const maxViews = Math.max(1, ...(data?.dailyViews.map((item) => item.views) ?? [0]));

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm md:p-5">
      <div className="min-w-0">
        <h2 className="text-headline-md font-semibold text-primary">
          Biểu đồ lượt xem theo ngày
        </h2>
        <p className="mt-1 text-label-md text-on-surface-variant">
          {days} ngày gần nhất
        </p>
      </div>

      {isLoading ? (
        <div className="mt-5 h-52 animate-pulse rounded-xl bg-surface-container-low" />
      ) : null}

      {isError ? (
        <p className="mt-5 rounded-lg border border-error/25 bg-error-container/40 px-4 py-3 text-label-md text-error">
          {errorMessage ?? "Không tải được biểu đồ lưu lượng."}
        </p>
      ) : null}

      {!isLoading && !isError && data ? (
        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-[32rem] items-end gap-1.5 pb-1 md:min-w-0 md:gap-2">
            {data.dailyViews.map((point) => {
              const heightPercent =
                point.views <= 0 ? 0 : Math.max(10, (point.views / maxViews) * 100);

              return (
                <div
                  className="flex min-w-[2rem] flex-1 flex-col items-center gap-1.5"
                  key={point.date}
                  title={`${formatChartDayLabel(point.date)}: ${point.views} lượt`}
                >
                  <span className="flex h-5 w-full shrink-0 items-center justify-center text-[10px] font-semibold leading-none text-on-surface-variant sm:text-label-sm">
                    {point.views}
                  </span>
                  <div className="flex h-28 w-full items-end justify-center rounded-md bg-surface-container-low px-0.5 pt-1">
                    <div
                      className="w-full max-w-[2rem] rounded-t-md bg-secondary transition-[height] duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="flex h-4 w-full shrink-0 items-center justify-center text-[10px] leading-none text-on-surface-variant sm:text-label-sm">
                    {formatChartDayLabel(point.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
