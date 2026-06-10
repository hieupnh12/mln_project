import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";

type ExamSessionHeaderProps = {
  courseTitle: string;
  examTitle: string;
  timerLabel: string;
  timerUrgent?: boolean;
  timerCritical?: boolean;
  onSubmit: () => void;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
};

export function ExamSessionHeader({
  courseTitle,
  examTitle,
  timerLabel,
  timerUrgent = false,
  timerCritical = false,
  onSubmit,
  submitDisabled = false,
  isSubmitting = false,
  hasSubmitted = false,
}: ExamSessionHeaderProps) {
  const timerClass = timerCritical
    ? "border-error bg-error-container text-error"
    : timerUrgent
      ? "border-secondary bg-secondary-container/40 text-primary"
      : "border-outline-variant bg-surface-container-low text-primary";

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-margin-mobile shadow-sm md:px-margin-desktop">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        <span className="hidden shrink-0 text-headline-md font-bold text-primary sm:inline">
          Kiểm tra
        </span>
        <div className="hidden h-6 w-px bg-outline-variant sm:block" />
        <div className="min-w-0">
          <h1 className="truncate text-label-md font-semibold text-primary md:text-body-md">
            {examTitle}
          </h1>
          <p className="hidden truncate text-label-sm text-on-surface-variant md:block">
            {courseTitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 md:gap-2 md:px-4 ${timerClass}`}
          title={timerCritical ? "Sắp hết giờ" : undefined}
        >
          <MaterialIcon className="text-[18px] md:text-[20px]">timer</MaterialIcon>
          <span className="text-label-md font-bold tabular-nums">{timerLabel}</span>
        </div>
        <button
          className="rounded-lg bg-error px-3 py-2 text-label-md font-medium text-on-error transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-6"
          disabled={submitDisabled}
          onClick={onSubmit}
          type="button"
        >
          {isSubmitting ? "Đang nộp..." : hasSubmitted ? "Đã nộp" : "Nộp bài"}
        </button>
      </div>
    </header>
  );
}
