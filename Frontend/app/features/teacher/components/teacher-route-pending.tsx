type TeacherRoutePendingProps = {
  label?: string;
};

export function TeacherRoutePending({
  label = "Đang tải trang...",
}: TeacherRoutePendingProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="rounded-[24px] border border-outline-variant/30 bg-landing-white p-6 shadow-lg shadow-landing-text/5 md:p-8"
      role="status"
    >
      <span className="sr-only">{label}</span>
      <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-landing-gray" />
      <div className="mb-6 h-4 w-72 max-w-full animate-pulse rounded bg-landing-gray" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-28 animate-pulse rounded-xl bg-landing-gray" />
        <div className="h-28 animate-pulse rounded-xl bg-landing-gray" />
        <div className="h-28 animate-pulse rounded-xl bg-landing-gray md:col-span-2" />
      </div>
      <p className="mt-5 text-center text-label-md font-medium text-landing-text-soft">
        {label}
      </p>
    </div>
  );
}
