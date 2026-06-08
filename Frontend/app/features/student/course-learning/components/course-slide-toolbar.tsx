import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type CourseSlideToolbarProps = {
  lessonTitle: string;
  activeIndex: number;
  totalSlides: number;
  slideProgressPercent: number;
  isLessonCompleted: boolean;
  isOnLastSlide: boolean;
  canGoToNextLesson: boolean;
  isSlideLoading: boolean;
  nextLessonTitle?: string;
  onPrevious: () => void;
  onNext: () => void;
  onGoToNextLesson?: () => void;
  onFullscreenToggle: () => void;
};

export function CourseSlideToolbar({
  lessonTitle,
  activeIndex,
  totalSlides,
  slideProgressPercent,
  isLessonCompleted,
  isOnLastSlide,
  canGoToNextLesson,
  isSlideLoading,
  nextLessonTitle,
  onPrevious,
  onNext,
  onGoToNextLesson,
  onFullscreenToggle,
}: CourseSlideToolbarProps) {
  return (
    <div className="border-t border-outline-variant/15 bg-surface-container-low/40 px-md py-md sm:px-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Bài học
          </p>
          <h2 className="mt-0.5 line-clamp-2 text-headline-md font-semibold text-primary">
            {lessonTitle}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLessonCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
              <MaterialIcon className="text-sm" filled>
                check_circle
              </MaterialIcon>
              Đã hoàn thành
            </span>
          ) : null}
          <button
            aria-label="Phóng to slide"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary shadow-sm transition-colors hover:bg-secondary-container hover:text-secondary"
            onClick={onFullscreenToggle}
            type="button"
          >
            <MaterialIcon>fullscreen</MaterialIcon>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-4 text-label-sm">
          <span className="font-medium text-on-surface-variant">Tiến độ slide</span>
          <span className="font-semibold text-primary">{slideProgressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-outline-variant/25">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-300"
            style={{ width: `${slideProgressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
        <button
          aria-label="Slide trước"
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/40 bg-white px-4 py-2 text-label-md font-medium text-primary transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={activeIndex === 0 || isSlideLoading}
          onClick={onPrevious}
          type="button"
        >
          <MaterialIcon>chevron_left</MaterialIcon>
          Trước
        </button>

        <span className="rounded-full bg-white px-4 py-2 text-label-sm font-semibold text-on-surface shadow-sm">
          {activeIndex + 1} / {totalSlides}
        </span>

        {canGoToNextLesson ? (
          <button
            aria-label={`Chuyển sang bài học tiếp theo: ${nextLessonTitle ?? ""}`}
            className="inline-flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-label-md font-medium text-on-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSlideLoading}
            onClick={onGoToNextLesson}
            type="button"
          >
            Bài học tiếp
            <MaterialIcon>chevron_right</MaterialIcon>
          </button>
        ) : (
          <button
            aria-label="Slide tiếp theo"
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/40 bg-white px-4 py-2 text-label-md font-medium text-primary transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isOnLastSlide || isSlideLoading}
            onClick={onNext}
            type="button"
          >
            Tiếp
            <MaterialIcon>chevron_right</MaterialIcon>
          </button>
        )}
      </div>
    </div>
  );
}
