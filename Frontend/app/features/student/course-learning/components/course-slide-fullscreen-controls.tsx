import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type CourseSlideFullscreenControlsProps = {
  activeIndex: number;
  totalSlides: number;
  slideProgressPercent: number;
  isLessonCompleted: boolean;
  isSlideLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFullscreenToggle: () => void;
};

export function CourseSlideFullscreenControls({
  activeIndex,
  totalSlides,
  slideProgressPercent,
  isLessonCompleted,
  isSlideLoading,
  onPrevious,
  onNext,
  onFullscreenToggle,
}: CourseSlideFullscreenControlsProps) {
  const isOnLastSlide = activeIndex >= totalSlides - 1;

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20 bg-linear-to-b from-primary/70 to-transparent px-md pb-4 pt-md sm:px-lg">
        <div className="flex items-center justify-between gap-4">
          <span className="text-label-sm font-medium text-white/90">Tiến độ slide</span>
          <span className="text-label-sm font-semibold text-white">{slideProgressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-secondary-container transition-all duration-300"
            style={{ width: `${slideProgressPercent}%` }}
          />
        </div>
      </div>

      {isLessonCompleted ? (
        <div className="absolute right-md top-16 z-20 flex items-center gap-1 rounded-full bg-secondary-container/95 px-3 py-1 text-label-sm font-semibold text-secondary shadow-sm">
          <MaterialIcon className="text-sm" filled>
            check_circle
          </MaterialIcon>
          Đã hoàn thành
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-linear-to-t from-primary/20 to-transparent p-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          aria-label="Thu nhỏ"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-secondary-container"
          onClick={onFullscreenToggle}
          type="button"
        >
          <MaterialIcon className="text-primary">fullscreen_exit</MaterialIcon>
        </button>

        <div className="flex items-center gap-4 rounded-full bg-white/90 px-4 py-2 shadow-sm">
          <button
            aria-label="Slide trước"
            className="flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary disabled:opacity-40"
            disabled={activeIndex === 0 || isSlideLoading}
            onClick={onPrevious}
            type="button"
          >
            <MaterialIcon>chevron_left</MaterialIcon>
            Trước
          </button>
          <span className="border-x border-outline-variant px-4 text-label-sm font-semibold">
            {activeIndex + 1} / {totalSlides}
          </span>
          <button
            aria-label="Slide tiếp theo"
            className="flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary disabled:opacity-40"
            disabled={isOnLastSlide || isSlideLoading}
            onClick={onNext}
            type="button"
          >
            Tiếp
            <MaterialIcon>chevron_right</MaterialIcon>
          </button>
        </div>
      </div>
    </>
  );
}
