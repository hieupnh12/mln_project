import type { CourseStructureMaterialDetail } from "../../types/course-structure.types";

type MaterialYoutubeViewerProps = {
  material: CourseStructureMaterialDetail;
};

export function MaterialYoutubeViewer({ material }: MaterialYoutubeViewerProps) {
  const embedUrl = material.youtubeEmbedUrl;

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-low p-gutter text-center">
        <p className="text-body-md text-on-surface-variant">
          Không thể phát video YouTube cho tài liệu này.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-black shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="aspect-video w-full">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embedUrl}
          title={material.title}
        />
      </div>
    </section>
  );
}
