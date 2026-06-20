import { CheckCircle2, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type CourseSlideOverlayControlsProps = {
  activeIndex: number;
  totalSlides: number;
  isLessonCompleted: boolean;
  isSlideLoading: boolean;
  onFullscreenToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function CourseSlideOverlayControls({
  activeIndex,
  totalSlides,
  isLessonCompleted,
  isSlideLoading,
  onFullscreenToggle,
  onNext,
  onPrevious,
}: CourseSlideOverlayControlsProps) {
  return (
    <>
      {isLessonCompleted ? (
        <div className="absolute right-14 top-3 z-20 flex items-center gap-1.5 rounded-full bg-landing-white/95 px-3 py-1 text-label-sm font-semibold text-landing-red shadow-sm">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          Đã hoàn thành
        </div>
      ) : null}

      <button
        aria-label="Phóng to slide"
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-landing-white/95 text-landing-text shadow-sm transition hover:text-landing-red"
        onClick={onFullscreenToggle}
        type="button"
      >
        <Maximize2 aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        aria-label="Slide trước"
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-landing-white/90 text-landing-text shadow-md transition hover:bg-landing-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={activeIndex === 0 || isSlideLoading}
        onClick={onPrevious}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        aria-label="Slide tiếp theo"
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-landing-white/90 text-landing-text shadow-md transition hover:bg-landing-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={activeIndex >= totalSlides - 1 || isSlideLoading}
        onClick={onNext}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-landing-text/75 px-3 py-1 text-label-sm font-semibold text-on-primary">
        {activeIndex + 1} / {totalSlides}
      </div>
    </>
  );
}
