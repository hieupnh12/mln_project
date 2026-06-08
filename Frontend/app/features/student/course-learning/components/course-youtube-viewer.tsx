import type { CourseMaterialDetail } from "../types/course-learning.types";

type CourseYoutubeViewerProps = {
  material: CourseMaterialDetail;
  lessonTitle: string;
};

const stageCardClassName =
  "relative overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]";

export function CourseYoutubeViewer({ material, lessonTitle }: CourseYoutubeViewerProps) {
  const embedUrl = material.youtubeEmbedUrl;

  if (!embedUrl) {
    return (
      <section
        className={`${stageCardClassName} flex aspect-video items-center justify-center bg-surface-container-low p-gutter text-center`}
      >
        <div className="space-y-2">
          <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Bài học
          </p>
          <h2 className="text-headline-md font-semibold text-primary">{lessonTitle}</h2>
          <p className="text-body-md text-on-surface-variant">
            Không thể phát video YouTube cho tài liệu này.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={stageCardClassName}>
      <div className="aspect-video w-full bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embedUrl}
          title={lessonTitle}
        />
      </div>
      <div className="border-t border-outline-variant/15 bg-surface-container-low/40 px-md py-3 sm:px-lg">
        <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Bài học
        </p>
        <h2 className="mt-0.5 text-headline-md font-semibold text-primary">{lessonTitle}</h2>
      </div>
    </section>
  );
}
