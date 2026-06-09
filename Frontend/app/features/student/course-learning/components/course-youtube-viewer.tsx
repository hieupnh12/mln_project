import { PlayCircle } from "lucide-react";

import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseYoutubeViewerProps = {
  material: CourseMaterialDetail;
  lessonTitle: string;
};

const stageCardClassName =
  "relative overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-xl shadow-landing-text/5";

export function CourseYoutubeViewer({ material, lessonTitle }: CourseYoutubeViewerProps) {
  const embedUrl = material.youtubeEmbedUrl;

  if (!embedUrl) {
    return (
      <section
        className={`${stageCardClassName} flex aspect-video items-center justify-center bg-landing-gray p-gutter text-center`}
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
    <section className={stageCardClassName}>
      <div className="aspect-video w-full bg-landing-text">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embedUrl}
          title={lessonTitle}
        />
      </div>
      <div className="border-t border-outline-variant/20 bg-landing-white px-md py-4 sm:px-lg">
        <p className="text-label-sm font-semibold text-landing-red">Bài học video</p>
        <h2 className="mt-1 text-headline-md font-semibold text-landing-text">{lessonTitle}</h2>
      </div>
    </section>
  );
}
