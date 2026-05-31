import { useState } from "react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseSlideViewerProps = {
  material: CourseMaterialDetail;
};

export function CourseSlideViewer({ material }: CourseSlideViewerProps) {
  const slides = material.slides;
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <img
        alt={`${material.title} - slide ${activeIndex + 1}`}
        className="h-full w-full object-contain bg-surface-container-lowest"
        src={currentSlide.imageUrl}
      />

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 bg-linear-to-t from-primary/25 to-transparent p-md opacity-100 transition-opacity sm:flex-row sm:items-center sm:justify-between lg:opacity-0 lg:group-hover:opacity-100">
        <p className="truncate text-label-md font-medium text-primary sm:max-w-[50%]">
          {material.title}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm">
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
