import { Presentation } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useSlideLessonProgress } from "../../student-progress/hooks/use-slide-lesson-progress";
import type { StudentProgressStatus } from "../../student-progress/types/student-progress.types";
import { useCourseSlideKeyboard } from "../hooks/use-course-slide-keyboard";
import { useSlideImageLoad } from "../hooks/use-slide-image-load";
import type { CourseMaterialDetail } from "../types/course-learning.types";
import { CourseSlideFullscreenControls } from "./course-slide-fullscreen-controls";
import { CourseSlideOverlayControls } from "./course-slide-overlay-controls";
import { CourseSlideStage } from "./course-slide-stage";

type CourseSlideViewerProps = {
  fitToViewport?: boolean;
  material: CourseMaterialDetail;
  lessonTitle: string;
  subjectId: number;
  lessonStatus?: StudentProgressStatus;
};

const stageCardClassName =
  "overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-xl shadow-landing-text/5";

export function CourseSlideViewer({
  fitToViewport = false,
  material,
  lessonTitle,
  subjectId,
  lessonStatus,
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
      // Fullscreen can be rejected by the browser without a direct user gesture.
    }
  }

  const currentSlide = slides[activeIndex];
  const {
    displayedImageUrl,
    isSlideLoading,
    handleSlideImageLoad,
    handleSlideImageError,
  } = useSlideImageLoad(currentSlide?.imageUrl ?? "", material.id);

  function handlePrevious() {
    if (!isSlideLoading) {
      setActiveIndex((index) => Math.max(0, index - 1));
    }
  }

  function handleNext() {
    if (!isSlideLoading) {
      setActiveIndex((index) => Math.min(totalSlides - 1, index + 1));
    }
  }

  useCourseSlideKeyboard({
    activeIndex,
    enabled: !isFullscreen && totalSlides > 0,
    isSlideLoading,
    onNext: handleNext,
    onPrevious: handlePrevious,
    totalSlides,
  });

  if (slides.length === 0) {
    return (
      <section
        className={`${stageCardClassName} flex ${
          fitToViewport ? "h-full min-h-0" : "aspect-video"
        } items-center justify-center bg-landing-gray p-gutter text-center`}
      >
        <div className="space-y-3">
          <Presentation aria-hidden="true" className="mx-auto h-10 w-10 text-landing-red" />
          <h2 className="text-headline-md font-semibold text-landing-text">{lessonTitle}</h2>
          <p className="text-body-md text-landing-text-soft">
            Slide chưa có dữ liệu hiển thị.
          </p>
        </div>
      </section>
    );
  }

  const isLessonCompleted = lessonStatus === "COMPLETED";
  const controlProps = {
    activeIndex,
    totalSlides,
    isLessonCompleted,
    isSlideLoading,
    onPrevious: handlePrevious,
    onNext: handleNext,
    onFullscreenToggle: handleFullscreenToggle,
  };

  const stageClassName = isFullscreen
    ? "h-screen w-screen bg-landing-text"
    : fitToViewport
      ? "h-full min-h-0 w-full bg-landing-gray"
      : "aspect-video bg-landing-gray";

  return (
    <div
      className={
        isFullscreen
          ? ""
          : `${stageCardClassName} ${fitToViewport ? "flex h-full min-h-0 flex-col" : ""}`
      }
    >
      <section className={`group relative ${stageClassName}`} ref={containerRef}>
        <CourseSlideStage
          alt={`${lessonTitle} - slide ${activeIndex + 1}`}
          displayedImageUrl={displayedImageUrl}
          imageUrl={currentSlide.imageUrl}
          isSlideLoading={isSlideLoading}
          onImageError={handleSlideImageError}
          onImageLoad={handleSlideImageLoad}
        />

        {isFullscreen ? (
          <CourseSlideFullscreenControls
            {...controlProps}
            slideProgressPercent={slideProgressPercent}
          />
        ) : (
          <CourseSlideOverlayControls {...controlProps} />
        )}
      </section>
    </div>
  );
}
