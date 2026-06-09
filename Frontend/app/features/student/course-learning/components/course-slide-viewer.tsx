import { useEffect, useRef, useState } from "react";

import { useSlideLessonProgress } from "../../student-progress/hooks/use-slide-lesson-progress";
import type { StudentProgressStatus } from "../../student-progress/types/student-progress.types";
import { useSlideImageLoad } from "../hooks/use-slide-image-load";
import type { CourseMaterialDetail } from "../types/course-learning.types";
import { CourseSlideFullscreenControls } from "./course-slide-fullscreen-controls";
import { CourseSlideStage } from "./course-slide-stage";
import { CourseSlideToolbar } from "./course-slide-toolbar";

type CourseSlideNextLesson = {
  lessonTitle: string;
};

type CourseSlideViewerProps = {
  material: CourseMaterialDetail;
  lessonTitle: string;
  subjectId: number;
  lessonStatus?: StudentProgressStatus;
  nextLesson?: CourseSlideNextLesson;
  onGoToNextLesson?: () => void;
};

const stageCardClassName =
  "overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]";

export function CourseSlideViewer({
  material,
  lessonTitle,
  subjectId,
  lessonStatus,
  nextLesson,
  onGoToNextLesson,
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

  const currentSlide = slides[activeIndex];
  const { displayedImageUrl, isSlideLoading, handleSlideImageLoad, handleSlideImageError } =
    useSlideImageLoad(currentSlide?.imageUrl ?? "", material.id);

  function handlePrevious() {
    if (isSlideLoading) {
      return;
    }

    setActiveIndex((index) => Math.max(0, index - 1));
  }

  function handleNext() {
    if (isSlideLoading) {
      return;
    }

    setActiveIndex((index) => Math.min(totalSlides - 1, index + 1));
  }

  function handleGoToNextLesson() {
    if (isSlideLoading) {
      return;
    }

    onGoToNextLesson?.();
  }

  if (slides.length === 0) {
    return (
      <section
        className={`${stageCardClassName} flex aspect-video items-center justify-center bg-surface-container-low p-gutter text-center`}
      >
        <div className="space-y-2">
          <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Bài học
          </p>
          <h2 className="text-headline-md font-semibold text-primary">{lessonTitle}</h2>
          <p className="text-body-md text-on-surface-variant">Slide chưa có dữ liệu hiển thị.</p>
        </div>
      </section>
    );
  }

  const isLessonCompleted = lessonStatus === "COMPLETED";
  const isOnLastSlide = activeIndex >= totalSlides - 1;
  const canGoToNextLesson = isOnLastSlide && nextLesson != null && onGoToNextLesson != null;

  const controlProps = {
    activeIndex,
    totalSlides,
    slideProgressPercent,
    isLessonCompleted,
    isOnLastSlide,
    canGoToNextLesson,
    nextLessonTitle: nextLesson?.lessonTitle,
    onPrevious: handlePrevious,
    onNext: handleNext,
    isSlideLoading,
    onGoToNextLesson: handleGoToNextLesson,
    onFullscreenToggle: handleFullscreenToggle,
  };

  return (
    <div className={isFullscreen ? "" : stageCardClassName}>
      <section
        className={`group relative aspect-video bg-surface-container-low ${
          isFullscreen ? "h-screen w-screen bg-black" : ""
        }`}
        ref={containerRef}
      >
        <CourseSlideStage
          alt={`${lessonTitle} - slide ${activeIndex + 1}`}
          displayedImageUrl={displayedImageUrl}
          imageUrl={currentSlide.imageUrl}
          isSlideLoading={isSlideLoading}
          onImageError={handleSlideImageError}
          onImageLoad={handleSlideImageLoad}
        />

        {isFullscreen ? <CourseSlideFullscreenControls {...controlProps} /> : null}
      </section>

      {!isFullscreen ? (
        <CourseSlideToolbar lessonTitle={lessonTitle} {...controlProps} />
      ) : null}
    </div>
  );
}
