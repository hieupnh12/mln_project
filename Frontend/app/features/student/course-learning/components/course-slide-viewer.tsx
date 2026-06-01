import { useRef, useState } from "react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseSlideViewerProps = {
  material: CourseMaterialDetail;
};

export function CourseSlideViewer({ material }: CourseSlideViewerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const slides = material.slides;
  const [activeIndex, setActiveIndex] = useState(0);

  function handleFullscreen() {
    containerRef.current?.requestFullscreen?.();
  }

  if (slides.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-low p-gutter text-center">
        <p className="text-body-md text-on-surface-variant">
          Slide chưa có dữ liệu hiển thị.
        </p>
      </div>
    );
  }

  const currentSlide = slides[activeIndex];
  const totalSlides = slides.length;

  return (
    <section
      className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition-transform active:scale-[0.995]"
      ref={containerRef}
    >
      <img
        alt={`${material.title} - slide ${activeIndex + 1}`}
        className="h-full w-full object-cover"
        src={currentSlide.imageUrl}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-primary/20 to-transparent p-md opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
        <div className="flex gap-2">
          <button
            aria-label="Toàn màn hình"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-secondary-container"
            onClick={handleFullscreen}
            type="button"
          >
            <MaterialIcon className="text-primary">fullscreen</MaterialIcon>
          </button>
          <button
            aria-label="Cài đặt hiển thị"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-secondary-container"
            type="button"
          >
            <MaterialIcon className="text-primary">settings</MaterialIcon>
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
            onClick={() =>
              setActiveIndex((index) => Math.min(totalSlides - 1, index + 1))
            }
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
