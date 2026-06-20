import { ListTree } from "lucide-react";

type CourseSlideMobileToolbarProps = {
  lessonTitle: string;
  onOpenCurriculum: () => void;
};

export function CourseSlideMobileToolbar({
  lessonTitle,
  onOpenCurriculum,
}: CourseSlideMobileToolbarProps) {
  return (
    <div className="mb-2 flex shrink-0 items-center gap-2 md:hidden">
      <button
        className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-outline-variant/35 bg-landing-white px-3 py-2 text-label-md font-semibold text-secondary shadow-sm transition hover:border-secondary/25 hover:bg-secondary-container/35"
        onClick={onOpenCurriculum}
        type="button"
      >
        <ListTree aria-hidden="true" className="h-4 w-4" />
        Lộ trình
      </button>

      <p className="min-w-0 flex-1 truncate text-label-md font-medium text-landing-text">
        {lessonTitle}
      </p>
    </div>
  );
}
