export function ExamSessionSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="fixed top-0 z-50 h-16 w-full animate-pulse border-b border-outline-variant bg-surface-container-low" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-gutter px-margin-mobile pt-24 md:flex-row md:px-margin-desktop">
        <aside className="h-96 w-full animate-pulse rounded-xl bg-surface-container md:w-80" />
        <section className="min-h-[420px] flex-1 animate-pulse rounded-xl bg-surface-container-low" />
      </div>
    </div>
  );
}
