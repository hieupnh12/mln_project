type CourseProgressBarProps = {
  progress: number;
  className?: string;
};

export function CourseProgressBar({ progress, className = "" }: CourseProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`w-full rounded-full border border-outline-variant bg-surface-container-high p-1 md:w-72 ${className}`}
    >
      <div className="mb-1 flex justify-between px-4">
        <span className="text-label-sm font-semibold text-on-surface-variant">Tiến độ</span>
        <span className="text-label-sm font-semibold text-primary">{clampedProgress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
        <div
          className="h-full rounded-full bg-secondary transition-all duration-1000 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
