import { useAsyncActivityStore } from "../stores/async-activity-store";
import type { AsyncActivityItem } from "../types/async-activity.types";

export function AsyncActivityBar() {
  const activities = useAsyncActivityStore((state) => state.activities);
  const remove = useAsyncActivityStore((state) => state.remove);

  const visible = activities.filter(
    (item) => item.status === "running" || item.status === "error",
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Tiến trình hoạt động"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col gap-2 p-3 sm:p-4"
      role="region"
    >
      {visible.map((activity) => (
        <ActivityCard activity={activity} key={activity.id} onDismiss={() => remove(activity.id)} />
      ))}
    </div>
  );
}

function ActivityCard({
  activity,
  onDismiss,
}: {
  activity: AsyncActivityItem;
  onDismiss: () => void;
}) {
  const isError = activity.status === "error";
  const isRunning = activity.status === "running";
  const showPercent = isRunning && !activity.indeterminate;

  return (
    <div className="pointer-events-auto mx-auto w-full max-w-xl rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 shadow-lg">
      <div className="flex items-start gap-3">
        <div
          className={
            isError
              ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container"
              : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary"
          }
        >
          {isRunning ? <SpinnerIcon /> : isError ? <ErrorIcon /> : <SuccessIcon />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-label-md font-medium text-on-surface">{activity.label}</p>
              {activity.detail ? (
                <p className="mt-0.5 truncate text-label-sm text-on-surface-variant">
                  {activity.detail}
                </p>
              ) : null}
            </div>
            {showPercent ? (
              <span className="shrink-0 font-mono text-label-sm text-secondary">
                {Math.round(activity.progress)}%
              </span>
            ) : null}
            {isError ? (
              <button
                aria-label="Đóng thông báo lỗi"
                className="shrink-0 rounded px-2 py-1 text-label-sm text-on-surface-variant hover:bg-surface-container-high"
                onClick={onDismiss}
                type="button"
              >
                Đóng
              </button>
            ) : null}
          </div>

          {isRunning ? (
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
              {activity.indeterminate ? (
                <div className="async-progress-indeterminate h-full w-1/3 rounded-full bg-secondary" />
              ) : (
                <div
                  className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.max(8, activity.progress)}%` }}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 animate-spin text-secondary"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
