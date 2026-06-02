import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type PracticeTopBarProps = {
  courseTitle: string;
  questionLabel: string;
  sessionTimeLabel: string;
  exitHref: string;
  onEnd: () => void;
};

export function PracticeTopBar({
  courseTitle,
  questionLabel,
  sessionTimeLabel,
  exitHref,
  onEnd,
}: PracticeTopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/10 bg-background px-margin-mobile text-primary md:px-margin-desktop">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          aria-label="Thoát luyện tập"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          to={exitHref}
        >
          <MaterialIcon>close</MaterialIcon>
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-label-md font-bold text-primary">{courseTitle}</h1>
          <p className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
            {questionLabel}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1.5 md:flex">
          <MaterialIcon className="text-[18px]">timer</MaterialIcon>
          <span className="text-label-md font-medium">{sessionTimeLabel}</span>
        </div>
        <button
          className="rounded-lg bg-surface-container px-4 py-2 text-label-md font-medium text-on-surface-variant transition-all hover:bg-surface-variant"
          onClick={onEnd}
          type="button"
        >
          Kết thúc
        </button>
      </div>
    </header>
  );
}
