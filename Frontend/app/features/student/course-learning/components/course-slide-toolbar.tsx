import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

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
    <div className="border-t border-outline-variant/25 bg-landing-white px-md py-md sm:px-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-label-sm font-semibold text-landing-red">Bài học</p>
          <h2 className="mt-1 line-clamp-2 text-headline-md font-semibold text-landing-text">
            {lessonTitle}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLessonCompleted ? (
            <span className="hidden items-center gap-1.5 rounded-full bg-landing-red/10 px-3 py-1 text-label-sm font-semibold text-landing-red sm:inline-flex">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Đã hoàn thành
            </span>
          ) : null}
          <button
            aria-label="Phóng to slide"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 bg-landing-white text-landing-text transition hover:border-landing-red/25 hover:text-landing-red"
            onClick={onFullscreenToggle}
            type="button"
          >
            <Maximize2 aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-4 text-label-sm">
          <span className="font-medium text-landing-text-soft">Tiến độ slide</span>
          <span className="font-semibold text-landing-red">{slideProgressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-landing-gray">
          <div
            className="h-full rounded-full bg-gradient-to-r from-landing-red to-landing-gold transition-all duration-300"
            style={{ width: `${slideProgressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          aria-label="Slide trước"
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-outline-variant/40 bg-landing-white px-3 py-2 text-label-md font-semibold text-landing-text transition hover:border-landing-red/25 hover:text-landing-red disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
          disabled={activeIndex === 0 || isSlideLoading}
          onClick={onPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <span className="rounded-full bg-landing-gray px-4 py-2 text-label-sm font-semibold text-landing-text">
          {activeIndex + 1} / {totalSlides}
        </span>

        {canGoToNextLesson ? (
          <button
            aria-label={`Chuyển sang bài học tiếp theo: ${nextLessonTitle ?? ""}`}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-landing-red px-3 py-2 text-label-md font-semibold text-on-primary transition hover:bg-landing-red-deep disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            disabled={isSlideLoading}
            onClick={onGoToNextLesson}
            type="button"
          >
            <span className="hidden sm:inline">Bài tiếp</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : (
          <button
            aria-label="Slide tiếp theo"
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-outline-variant/40 bg-landing-white px-3 py-2 text-label-md font-semibold text-landing-text transition hover:border-landing-red/25 hover:text-landing-red disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            disabled={isOnLastSlide || isSlideLoading}
            onClick={onNext}
            type="button"
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
