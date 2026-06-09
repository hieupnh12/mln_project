function SkeletonLine({ className }: { className: string }) {
  return <div aria-hidden="true" className={`rounded-full bg-surface-container ${className}`} />;
}

function ReviewQuestionSkeleton() {
  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <SkeletonLine className="h-7 w-24" />
        <SkeletonLine className="h-5 w-14" />
      </div>

      <div className="mb-6 space-y-2.5">
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-4/5" />
      </div>

      <div className="mb-7 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="flex min-h-14 items-center gap-3 rounded-lg border border-outline-variant/20 p-4"
            key={index}
          >
            <div className="h-5 w-5 shrink-0 rounded-full bg-surface-container" />
            <SkeletonLine className={`h-4 ${index % 2 === 0 ? "w-4/5" : "w-3/5"}`} />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg bg-surface-container-low p-5">
        <SkeletonLine className="h-4 w-40" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-3/4" />
      </div>
    </article>
  );
}

export function ExamReviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải chi tiết bài làm"
      className="flex h-screen flex-col overflow-hidden bg-background antialiased"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-low px-margin-mobile md:px-margin-desktop">
        <SkeletonLine className="h-6 w-32" />
        <SkeletonLine className="h-10 w-24 rounded-lg" />
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low p-6 lg:flex">
          <div className="space-y-3">
            <SkeletonLine className="h-6 w-40" />
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="h-4 w-36" />
          </div>
          <div className="mt-8 h-12 rounded-xl bg-surface-container" />
          <SkeletonLine className="mt-auto h-4 w-32" />
        </aside>

        <main className="min-h-0 flex-1 overflow-hidden p-margin-mobile md:p-margin-desktop">
          <div className="mx-auto max-w-[720px] animate-pulse">
            <header className="mb-lg space-y-3">
              <SkeletonLine className="h-4 w-36" />
              <SkeletonLine className="h-8 w-64 max-w-full" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-2/3" />
            </header>

            <section className="space-y-gutter">
              <ReviewQuestionSkeleton />
              <ReviewQuestionSkeleton />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
