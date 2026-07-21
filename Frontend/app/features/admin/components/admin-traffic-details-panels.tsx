import type {
  RecentPageView,
  TrafficPathStat,
} from "~/features/analytics/types/analytics.types";
import { formatAdminDateTime } from "../utils/format-admin-datetime";

type AdminTrafficDetailsPanelsProps = {
  topPaths: TrafficPathStat[];
  recentViews: RecentPageView[];
  isLoading: boolean;
};

export function AdminTrafficDetailsPanels({
  topPaths,
  recentViews,
  isLoading,
}: AdminTrafficDetailsPanelsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm md:p-5">
        <h2 className="text-headline-md font-semibold text-primary">
          Trang được xem nhiều
        </h2>
        <p className="mt-1 text-label-md text-on-surface-variant">
          Top đường dẫn theo lượt xem trong khoảng đã chọn
        </p>

        {isLoading ? (
          <div className="mt-4 h-40 animate-pulse rounded-xl bg-surface-container-low" />
        ) : null}

        {!isLoading && topPaths.length === 0 ? (
          <p className="mt-4 text-label-md text-on-surface-variant">
            Chưa có dữ liệu trang xem.
          </p>
        ) : null}

        {!isLoading && topPaths.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {topPaths.map((item, index) => (
              <li
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low px-3 py-2.5"
                key={`${item.path}-${index}`}
              >
                <div className="min-w-0">
                  <p className="text-label-sm text-on-surface-variant">#{index + 1}</p>
                  <p className="truncate text-label-md font-medium text-primary">
                    {item.path}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary-container/50 px-2.5 py-1 text-label-sm font-semibold text-primary">
                  {item.views}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm md:p-5">
        <h2 className="text-headline-md font-semibold text-primary">
          Hoạt động xem gần đây
        </h2>
        <p className="mt-1 text-label-md text-on-surface-variant">
          Các lượt xem mới nhất trên website
        </p>

        {isLoading ? (
          <div className="mt-4 h-40 animate-pulse rounded-xl bg-surface-container-low" />
        ) : null}

        {!isLoading && recentViews.length === 0 ? (
          <p className="mt-4 text-label-md text-on-surface-variant">
            Chưa có hoạt động xem gần đây.
          </p>
        ) : null}

        {!isLoading && recentViews.length > 0 ? (
          <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {recentViews.map((item, index) => (
              <li
                className="rounded-lg border border-outline-variant/20 bg-white px-3 py-2.5"
                key={`${item.path}-${item.viewedAt}-${index}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate text-label-md font-medium text-primary">
                    {item.viewerLabel}
                  </p>
                  <span className="shrink-0 text-label-sm text-on-surface-variant">
                    {formatAdminDateTime(item.viewedAt)}
                  </span>
                </div>
                <p className="mt-1 truncate text-label-sm text-secondary">{item.path}</p>
                {item.role ? (
                  <p className="mt-1 text-label-sm text-on-surface-variant">{item.role}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
