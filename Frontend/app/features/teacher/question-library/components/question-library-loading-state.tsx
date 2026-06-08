type QuestionLibraryLoadingStateProps = {
  label: string;
  minHeightClassName?: string;
  variant?: "panel" | "detail";
};

export function QuestionLibraryLoadingState({
  label,
  minHeightClassName = "min-h-48",
  variant = "panel",
}: QuestionLibraryLoadingStateProps) {
  const content =
    variant === "detail" ? <QuestionDetailSkeleton /> : <QuestionExportPanelSkeleton />;

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className={`${minHeightClassName} p-md lg:p-lg`}
      role="status"
    >
      <span className="sr-only">{label}</span>
      {content}
    </div>
  );
}

function QuestionExportPanelSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-lg" />
        <SkeletonBlock className="h-6 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-20 w-full rounded-lg" />
          <SkeletonBlock className="mx-auto h-4 w-40" />
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-11/12" />
      </div>

      <div className="space-y-3 rounded-xl border border-outline-variant/15 bg-surface-container-low/40 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-5 w-64 max-w-full" />
          </div>
          <SkeletonBlock className="h-9 w-24 rounded-full" />
        </div>
        <SkeletonBlock className="h-12 w-full rounded-lg" />
        <SkeletonBlock className="h-12 w-full rounded-lg" />
        <SkeletonBlock className="h-12 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SkeletonBlock className="h-14 w-full rounded-lg" />
        <SkeletonBlock className="h-14 w-full rounded-lg" />
      </div>
    </div>
  );
}

function QuestionDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-md">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-36" />
        <SkeletonBlock className="h-20 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="space-y-2 rounded-lg bg-surface-container-low px-3 py-2" key={index}>
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-5 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-12 w-full rounded-lg" />
        <SkeletonBlock className="h-12 w-full rounded-lg" />
        <SkeletonBlock className="h-12 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded bg-surface-container-high ${className}`} />;
}
