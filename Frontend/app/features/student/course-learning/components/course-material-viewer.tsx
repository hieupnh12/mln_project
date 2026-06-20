import { RefreshCw } from "lucide-react";
import { useMemo } from "react";

import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { useYoutubeLessonProgress } from "../../student-progress/hooks/use-youtube-lesson-progress";
import { buildLessonProgressMap } from "../../student-progress/utils/student-progress-resume.util";
import type { SubjectListItem } from "../../types/student.types";
import { studentCourseFeaturedQuote } from "../constants/student-course.constants";
import {
  useChapterLessonsQuery,
  useMaterialDetailQuery,
} from "../hooks/use-course-learning-queries";
import { resolveCourseCoverImage } from "../utils/resolve-course-cover-image";
import { CourseCoverPanel } from "./course-cover-panel";
import { CourseQuotePanel } from "./course-quote-panel";
import { CourseSlideMobileToolbar } from "./course-slide-mobile-toolbar";
import { CourseSlideViewer } from "./course-slide-viewer";
import { CourseYoutubeViewer } from "./course-youtube-viewer";

type CourseMaterialViewerProps = {
  fitToViewport?: boolean;
  onOpenCurriculum?: () => void;
  showMobileToolbar?: boolean;
  subjectId: number;
  subject: SubjectListItem | undefined;
  expandedChapterId: number | null;
  selectedMaterialId: number | null;
};

export function CourseMaterialViewer({
  fitToViewport = false,
  onOpenCurriculum,
  showMobileToolbar = false,
  subjectId,
  subject,
  expandedChapterId,
  selectedMaterialId,
}: CourseMaterialViewerProps) {
  const materialQuery = useMaterialDetailQuery(selectedMaterialId);
  const lessonsQuery = useChapterLessonsQuery(expandedChapterId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const coverImageUrl = resolveCourseCoverImage(subject?.title ?? "Môn học");
  const material = materialQuery.data;
  const lesson = lessonsQuery.data?.find((item) => item.id === material?.lessonId);
  const progressMap = useMemo(
    () => buildLessonProgressMap(progressQuery.data ?? []),
    [progressQuery.data],
  );
  const lessonProgress = material ? progressMap.get(material.lessonId) : undefined;

  useYoutubeLessonProgress({
    subjectId,
    lessonId: material?.lessonId ?? 0,
    currentStatus: lessonProgress?.status,
    enabled: material?.contentType === "YOUTUBE" && material.lessonId != null,
  });

  if (selectedMaterialId == null) {
    return (
      <div className="space-y-md">
        <CourseCoverPanel
          coverImageUrl={coverImageUrl}
          description={subject?.description}
          subjectTitle={subject?.title ?? "Đang tải môn học..."}
        />
        <CourseQuotePanel
          author={studentCourseFeaturedQuote.author}
          quote={studentCourseFeaturedQuote.quote}
        />
      </div>
    );
  }

  if (materialQuery.isLoading) {
    return (
      <div
        className={
          fitToViewport
            ? "h-full min-h-0 animate-pulse rounded-xl border border-outline-variant/35 bg-landing-white"
            : "aspect-video animate-pulse rounded-xl border border-outline-variant/35 bg-landing-white"
        }
      />
    );
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
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-5 py-2 text-label-md font-medium text-on-primary"
          onClick={() => materialQuery.refetch()}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    );
  }

  if (!material) {
    return null;
  }

  const lessonTitle = lesson?.title || "Bài học chưa đặt tên";

  return (
    <div className={fitToViewport ? "flex h-full min-h-0 flex-col" : "space-y-md"}>
      {showMobileToolbar && onOpenCurriculum ? (
        <CourseSlideMobileToolbar lessonTitle={lessonTitle} onOpenCurriculum={onOpenCurriculum} />
      ) : null}

      {material.contentType === "YOUTUBE" ? (
        <CourseYoutubeViewer
          fitToViewport={fitToViewport}
          lessonTitle={lessonTitle}
          material={material}
        />
      ) : (
        <CourseSlideViewer
          fitToViewport={fitToViewport}
          lessonStatus={lessonProgress?.status}
          lessonTitle={lessonTitle}
          material={material}
          subjectId={subjectId}
        />
      )}
    </div>
  );
}
