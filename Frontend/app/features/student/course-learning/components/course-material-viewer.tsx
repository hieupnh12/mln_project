import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { useMaterialDetailQuery } from "../hooks/use-course-learning-queries";
import type { SubjectListItem } from "../../types/student.types";
import { resolveCourseCoverImage } from "../utils/resolve-course-cover-image";
import { CourseCoverPanel } from "./course-cover-panel";
import { CourseSlideViewer } from "./course-slide-viewer";
import { CourseYoutubeViewer } from "./course-youtube-viewer";

type CourseMaterialViewerProps = {
  subject: SubjectListItem | undefined;
  selectedMaterialId: number | null;
};

function MaterialViewerSkeleton() {
  return (
    <div className="aspect-video animate-pulse rounded-xl border border-outline-variant/30 bg-surface-container-low" />
  );
}

export function CourseMaterialViewer({
  subject,
  selectedMaterialId,
}: CourseMaterialViewerProps) {
  const materialQuery = useMaterialDetailQuery(selectedMaterialId);
  const coverImageUrl = resolveCourseCoverImage(subject?.title ?? "Môn học");

  if (selectedMaterialId == null) {
    return (
      <CourseCoverPanel
        coverImageUrl={coverImageUrl}
        description={subject?.description}
        subjectTitle={subject?.title ?? "Đang tải môn học..."}
      />
    );
  }

  if (materialQuery.isLoading) {
    return <MaterialViewerSkeleton />;
  }

  if (materialQuery.isError) {
    return (
      <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
        <p className="text-body-md font-medium text-error">
          Không thể tải tài liệu học tập.
        </p>
        <p className="mt-1 text-label-md text-on-surface-variant">
          {materialQuery.error instanceof Error
            ? materialQuery.error.message
            : "Vui lòng thử lại sau."}
        </p>
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
        <CourseYoutubeViewer material={material} />
      ) : (
        <CourseSlideViewer material={material} />
      )}

      <aside className="rounded-lg border-l-4 border-secondary-container bg-primary-container p-md text-white shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-secondary-container">
          <MaterialIcon>info</MaterialIcon>
          <span className="text-label-md font-semibold uppercase tracking-wide">
            {material.contentType === "YOUTUBE" ? "Video bài giảng" : "Slide bài giảng"}
          </span>
        </div>
        <p className="text-headline-md font-semibold">{material.title}</p>
        {material.contentType === "SLIDE_DECK" ? (
          <p className="mt-2 text-label-md text-secondary-container/80">
            {material.slides.length} slide
          </p>
        ) : null}
      </aside>
    </div>
  );
}
