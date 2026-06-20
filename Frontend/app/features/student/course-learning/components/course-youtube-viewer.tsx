import { PlayCircle } from "lucide-react";

import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseYoutubeViewerProps = {
  fitToViewport?: boolean;
  material: CourseMaterialDetail;
  lessonTitle: string;
};

const stageCardClassName =
  "relative overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-xl shadow-landing-text/5";

export function CourseYoutubeViewer({
  fitToViewport = false,
  material,
  lessonTitle,
}: CourseYoutubeViewerProps) {
  const embedUrl = material.youtubeEmbedUrl;

  if (!embedUrl) {
    return (
      <section
        className={`${stageCardClassName} flex ${
          fitToViewport ? "h-full min-h-0" : "aspect-video"
        } items-center justify-center bg-landing-gray p-gutter text-center`}
      >
        <div className="space-y-3">
          <PlayCircle aria-hidden="true" className="mx-auto h-10 w-10 text-landing-red" />
          <h2 className="text-headline-md font-semibold text-landing-text">{lessonTitle}</h2>
          <p className="text-body-md text-landing-text-soft">
            Không thể phát video YouTube cho tài liệu này.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${stageCardClassName} ${
        fitToViewport ? "flex h-full min-h-0 flex-col" : ""
      }`}
    >
      <div
        className={
          fitToViewport
            ? "min-h-0 flex-1 bg-landing-text"
            : "aspect-video w-full bg-landing-text"
        }
      >
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embedUrl}
          title={lessonTitle}
        />
      </div>
    </section>
  );
}
