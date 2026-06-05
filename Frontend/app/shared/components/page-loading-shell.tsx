import { useEffect, useState } from "react";

type PageLoadingShellProps = {
  title: string;
  description?: string;
  statusLabel?: string;
  footerLabel?: string;
};

function useSimulatedProgress() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          return 100;
        }

        const step = current >= 90 ? Math.random() * 0.5 : Math.random() * 15;
        return Math.min(100, current + step);
      });
    }, 800);

    return () => window.clearInterval(interval);
  }, []);

  return progress;
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-10 w-10 text-primary"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function LockBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 text-outline"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        width="14"
        x="5"
        y="11"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function PageLoadingShell({
  title,
  description,
  statusLabel = "Bảo mật 256-bit",
  footerLabel = "ML Learning · Xác thực an toàn",
}: PageLoadingShellProps) {
  const progress = useSimulatedProgress();

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4 text-on-surface selection:bg-secondary-container/30 sm:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-container/20 blur-3xl"
      />

      <div
        aria-busy="true"
        aria-live="polite"
        className="relative box-border w-full max-w-md px-4 text-center"
        role="status"
        style={{ width: "100%" }}
      >
        <div className="relative mx-auto mb-12 w-20">
          <div className="loading-subtle-pulse mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container shadow-sm">
            <ShieldIcon />
          </div>
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-on-surface/5 bg-surface-container-highest">
            <LockBadgeIcon />
          </div>
        </div>

        <h1
          className="mx-auto w-full text-2xl font-semibold leading-snug tracking-tight text-primary"
          style={{ wordBreak: "normal", whiteSpace: "normal" }}
        >
          {title}
        </h1>

        {description ? (
          <p
            className="mx-auto mt-6 w-full max-w-[320px] text-base leading-relaxed text-on-surface-variant"
            style={{ wordBreak: "normal", whiteSpace: "normal" }}
          >
            {description}
          </p>
        ) : null}

        <div className="mx-auto mt-12 w-full max-w-[240px]">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-secondary-container transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex w-full items-center justify-center gap-1">
            <div aria-hidden="true" className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <footer className="pointer-events-none fixed bottom-12 left-0 w-full px-4 text-center sm:px-16">
        <span className="text-sm text-outline opacity-40">{footerLabel}</span>
      </footer>
    </main>
  );
}
