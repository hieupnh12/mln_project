import { useEffect, useRef, useState } from "react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { useSlideLessonProgress } from "../../student-progress/hooks/use-slide-lesson-progress";
import type { StudentProgressStatus } from "../../student-progress/types/student-progress.types";
import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseSlideViewerProps = {
  material: CourseMaterialDetail;
  lessonTitle: string;
  subjectId: number;
  lessonStatus?: StudentProgressStatus;
  onLessonCompleted?: () => void;
};

const stageCardClassName =
  "relative flex aspect-video items-end overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]";

export function CourseSlideViewer({
  material,
  lessonTitle,
  subjectId,
  lessonStatus,
  onLessonCompleted,
}: CourseSlideViewerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const slides = material.slides;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = slides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [material.id]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const { slideProgressPercent } = useSlideLessonProgress({
    subjectId,
    lessonId: material.lessonId,
    activeSlideIndex: activeIndex,
    totalSlides,
    currentStatus: lessonStatus,
    onLessonCompleted,
    enabled: totalSlides > 0,
  });

  async function handleFullscreenToggle() {
    if (!containerRef.current) {
      return;
    }

    try {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      // Browser may reject fullscreen without user gesture.
    }
  }

  if (slides.length === 0) {
    return (
      <section className={`${stageCardClassName} items-center justify-center bg-surface-container-low p-gutter text-center`}>
        <div className="relative z-10 space-y-2">
          <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Bài học
          </p>
          <h2 className="text-headline-md font-semibold text-primary">{lessonTitle}</h2>
          <p className="text-body-md text-on-surface-variant">Slide chưa có dữ liệu hiển thị.</p>
        </div>
      </section>
    );
  }

  const currentSlide = slides[activeIndex];
  const isLessonCompleted = lessonStatus === "COMPLETED";

  return (
    <section
      className={`group ${stageCardClassName} ${isFullscreen ? "aspect-auto h-screen w-screen rounded-none border-0 bg-black" : ""}`}
      ref={containerRef}
    >
      <img
        alt={`${lessonTitle} - slide ${activeIndex + 1}`}
        className={`absolute inset-0 h-full w-full ${isFullscreen ? "object-contain" : "object-cover"}`}
        src={currentSlide.imageUrl}
      />

      <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-transparent" />

      <div className="absolute inset-x-0 top-0 z-20 bg-linear-to-b from-primary/70 to-transparent px-md pb-4 pt-md sm:px-lg">
        <div className="flex items-center justify-between gap-4">
          <span className="text-label-sm font-medium text-white/90">
            Tiến độ slide: {activeIndex + 1}/{totalSlides}
          </span>
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

      <div className="relative z-10 w-full p-md sm:p-lg">
        <p className="text-label-sm font-semibold uppercase tracking-wider text-secondary-container">
          Bài học
        </p>
        <h2 className="mt-1 text-headline-lg font-semibold text-white">{lessonTitle}</h2>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-linear-to-t from-primary/20 to-transparent p-md transition-opacity duration-300 ${
          isFullscreen ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        }`}
      >
        <div className="flex gap-2">
          <button
            aria-label={isFullscreen ? "Thu nhỏ" : "Phóng to"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-secondary-container"
            onClick={handleFullscreenToggle}
            type="button"
          >
            <MaterialIcon className="text-primary">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </MaterialIcon>
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-full bg-white/90 px-4 py-2 shadow-sm">
          <button
            aria-label="Slide trước"
            className="flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary disabled:opacity-40"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
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
            disabled={activeIndex >= totalSlides - 1}
            onClick={() => setActiveIndex((index) => Math.min(totalSlides - 1, index + 1))}
            type="button"
          >
            Tiếp
            <MaterialIcon>chevron_right</MaterialIcon>
          </button>
        </div>
      </div>
    </section>
  );
}
