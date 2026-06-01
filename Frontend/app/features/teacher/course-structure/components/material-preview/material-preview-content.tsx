import { MaterialIcon } from "../../../components/teacher-icons";
import { useMaterialDetailQuery } from "../../hooks/use-course-structure-queries";
import { getMaterialTypeLabel } from "../../utils/map-course-structure-dto";
import { MaterialSlideViewer } from "./material-slide-viewer";
import { MaterialYoutubeViewer } from "./material-youtube-viewer";

type MaterialPreviewContentProps = {
  materialId: number;
};

function MaterialPreviewSkeleton() {
  return (
    <div className="aspect-video animate-pulse rounded-xl border border-outline-variant/30 bg-surface-container-low" />
  );
}

export function MaterialPreviewContent({ materialId }: MaterialPreviewContentProps) {
  const materialQuery = useMaterialDetailQuery(materialId);

  if (materialQuery.isLoading) {
    return <MaterialPreviewSkeleton />;
  }

  if (materialQuery.isError) {
    return (
      <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
        <p className="text-body-md font-medium text-error">Không thể tải nội dung tài liệu.</p>
        <button
          className="mt-4 rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary"
          onClick={() => materialQuery.refetch()}
          type="button"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const material = materialQuery.data;

  if (!material) {
    return null;
  }

  return (
    <div className="space-y-md">
      {material.contentType === "YOUTUBE" ? (
        <MaterialYoutubeViewer material={material} />
      ) : (
        <MaterialSlideViewer material={material} />
      )}

      <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-md">
        <div className="mb-1 flex items-center gap-2 text-secondary">
          <MaterialIcon>info</MaterialIcon>
          <span className="text-label-sm font-semibold uppercase tracking-wide">
            {getMaterialTypeLabel(material.contentType)}
          </span>
        </div>
        <p className="text-headline-md font-semibold text-primary">{material.title}</p>
        {material.contentType === "SLIDE_DECK" ? (
          <p className="mt-1 text-label-md text-on-surface-variant">
            {material.slides.length} slide
          </p>
        ) : null}
      </div>
    </div>
  );
}
