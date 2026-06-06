import { useCallback, useRef } from "react";
import type { SubjectListItem } from "../../types/student.types";
import { useYoutubeLessonProgress } from "../../student-progress/hooks/use-youtube-lesson-progress";
import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import { buildLessonProgressMap } from "../../student-progress/utils/student-progress-resume.util";
import { studentCourseFeaturedQuote } from "../constants/student-course.constants";
import {
  useChapterLessonsQuery,
  useMaterialDetailQuery,
} from "../hooks/use-course-learning-queries";
import { resolveCourseCoverImage } from "../utils/resolve-course-cover-image";
import { CourseCoverPanel } from "./course-cover-panel";
import { CourseQuotePanel } from "./course-quote-panel";
import { CourseSlideViewer } from "./course-slide-viewer";
import { CourseYoutubeViewer } from "./course-youtube-viewer";

type CourseMaterialViewerProps = {
  subjectId: number;
  subject: SubjectListItem | undefined;
  expandedChapterId: number | null;
  selectedMaterialId: number | null;
  onLessonCompleted?: (lessonId: number) => void;
};

function MaterialViewerSkeleton() {
  return (
    <div className="aspect-video animate-pulse rounded-xl border border-outline-variant/30 bg-surface-container-low" />
  );
}

export function CourseMaterialViewer({
  subjectId,
  subject,
  expandedChapterId,
  selectedMaterialId,
  onLessonCompleted,
}: CourseMaterialViewerProps) {
  const materialQuery = useMaterialDetailQuery(selectedMaterialId);
  const lessonsQuery = useChapterLessonsQuery(expandedChapterId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const coverImageUrl = resolveCourseCoverImage(subject?.title ?? "Môn học");

  const material = materialQuery.data;
  const lesson = lessonsQuery.data?.find((item) => item.id === material?.lessonId);
  const progressMap = buildLessonProgressMap(progressQuery.data ?? []);
  const lessonProgress = material ? progressMap.get(material.lessonId) : undefined;
  const onLessonCompletedRef = useRef(onLessonCompleted);
  onLessonCompletedRef.current = onLessonCompleted;

  const handleLessonCompleted = useCallback(() => {
    if (material) {
      onLessonCompletedRef.current?.(material.lessonId);
    }
  }, [material]);

  useYoutubeLessonProgress({
    subjectId,
    lessonId: material?.lessonId ?? 0,
    currentStatus: lessonProgress?.status,
    enabled: material?.contentType === "YOUTUBE" && material.lessonId != null,
    onLessonCompleted: material ? handleLessonCompleted : undefined,
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

  if (!material) {
    return null;
  }

  return (
    <div className="space-y-md">
      {material.contentType === "YOUTUBE" ? (
        <CourseYoutubeViewer
          lessonTitle={lesson?.title || "Bài học chưa đặt tên"}
          material={material}
        />
      ) : (
        <CourseSlideViewer
          lessonStatus={lessonProgress?.status}
          lessonTitle={lesson?.title || "Bài học chưa đặt tên"}
          material={material}
          onLessonCompleted={handleLessonCompleted}
          subjectId={subjectId}
        />
      )}

      <CourseQuotePanel
        author={studentCourseFeaturedQuote.author}
        quote={studentCourseFeaturedQuote.quote}
      />
    </div>
  );
}
