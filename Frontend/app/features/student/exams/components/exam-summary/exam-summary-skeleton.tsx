function SkeletonBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-surface-container ${className}`} />;
}

export function ExamSummarySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải tổng kết bài kiểm tra"
      className="min-h-svh bg-background font-body-md"
      role="status"
    >
      <span className="sr-only">Đang tải tổng kết bài kiểm tra...</span>

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-background px-margin-mobile shadow-sm md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <SkeletonBlock className="h-8 w-36 rounded-lg" />
        </div>
        <SkeletonBlock className="h-7 w-20 rounded-full" />
      </header>

      <main className="mx-auto max-w-6xl px-margin-mobile py-lg pb-32 md:px-margin-desktop">
        <div className="mb-lg space-y-3">
          <SkeletonBlock className="h-7 w-full max-w-xl rounded-lg" />
          <SkeletonBlock className="h-5 w-56 rounded-lg" />
          <SkeletonBlock className="h-4 w-36 rounded-lg" />
        </div>

        <section className="mb-xl rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-start gap-md sm:items-center">
            <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full sm:h-16 sm:w-16" />
            <div className="min-w-0 flex-1 space-y-4">
              <SkeletonBlock className="h-8 w-full max-w-sm rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-9 w-32 rounded-full" />
                <SkeletonBlock className="h-9 w-28 rounded-full" />
                <SkeletonBlock className="h-9 w-24 rounded-full" />
              </div>
              <SkeletonBlock className="h-4 w-full max-w-md rounded-lg" />
            </div>
          </div>
        </section>

        <div className="mb-lg grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm"
              key={index}
            >
              <SkeletonBlock className="h-4 w-24 rounded-lg" />
              <div className="space-y-2">
                <SkeletonBlock className="h-8 w-20 rounded-lg" />
                <SkeletonBlock className="h-3 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
          <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm lg:col-span-2">
            <SkeletonBlock className="h-6 w-52 rounded-lg" />
            <div className="mt-md flex flex-col gap-md sm:flex-row sm:items-center">
              <SkeletonBlock className="h-40 w-40 shrink-0 self-center rounded-full" />
              <div className="flex-1 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="space-y-2" key={index}>
                    <div className="flex justify-between gap-4">
                      <SkeletonBlock className="h-4 w-24 rounded-lg" />
                      <SkeletonBlock className="h-4 w-12 rounded-lg" />
                    </div>
                    <SkeletonBlock className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
            <SkeletonBlock className="h-6 w-40 rounded-lg" />
            <div className="mt-md space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock className="h-12 w-full rounded-lg" key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-xl flex flex-col items-center justify-center gap-md md:flex-row">
          <SkeletonBlock className="h-14 w-full rounded-lg md:w-56" />
          <SkeletonBlock className="h-14 w-full rounded-lg md:w-48" />
        </div>
      </main>
    </div>
  );
}
