type PracticeCountdownBarProps = {
  progressPercent: number;
  visible: boolean;
  variant?: "fixed" | "inline";
};

export function PracticeCountdownBar({
  progressPercent,
  visible,
  variant = "fixed",
}: PracticeCountdownBarProps) {
  if (!visible) {
    return null;
  }

  const positionClass =
    variant === "fixed"
      ? "fixed top-0 left-0 z-[60]"
      : "absolute top-0 left-0 z-10 w-full rounded-t-xl";

  return (
    <div
      aria-hidden={!visible}
      className={`${positionClass} h-1 bg-surface-container-high`}
    >
      <div
        className="h-full bg-secondary-container transition-[width] duration-100 ease-linear"
        style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
      />
    </div>
  );
}
