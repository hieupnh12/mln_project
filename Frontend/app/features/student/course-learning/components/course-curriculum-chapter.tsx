import { BrainCircuit, ChevronDown, Layers3, LockKeyhole } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import type { StudentChapterState } from "../../types/student.types";
import { LessonProgressStatusBadge } from "../../student-progress/components/lesson-progress-status-badge";
import type { StudentLessonProgress } from "../../student-progress/types/student-progress.types";
import { useChapterLessonsQuery } from "../hooks/use-course-learning-queries";
import type {
  CourseChapterItem,
  CourseMaterialSummary,
} from "../types/course-learning.types";
import { getMaterialTypeLabel } from "../utils/resolve-course-cover-image";
import { CourseMaterialThumbnail } from "./course-material-thumbnail";

type CourseCurriculumChapterProps = {
  chapter: CourseChapterItem;
  state: StudentChapterState;
  isExpanded: boolean;
  expandedLessonId: number | null;
  selectedMaterialId: number | null;
  lessonProgressMap: Map<number, StudentLessonProgress>;
  onToggleChapter: () => void;
  onToggleLesson: (chapterId: number, lessonId: number) => void;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
};

function getChapterClassName(state: StudentChapterState, isExpanded: boolean) {
  if (state === "locked") {
    return "border-outline-variant/30 bg-landing-gray/60 opacity-70";
  }
  if (state === "done") {
    return "border-landing-red/15 bg-landing-red/5";
  }
  if (state === "active" || isExpanded) {
    return "border-landing-red/25 bg-landing-white shadow-md shadow-landing-red/5";
  }
  return "border-outline-variant/35 bg-landing-white hover:border-landing-red/20";
}

function ChapterStatus({ state }: { state: StudentChapterState }) {
  if (state === "done") {
    return (
      <span className="rounded-full bg-landing-red/10 px-2.5 py-1 text-label-sm font-semibold text-landing-red">
        Hoàn thành
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="rounded-full bg-landing-gold/15 px-2.5 py-1 text-label-sm font-semibold text-landing-text-muted">
        Đang học
      </span>
    );
  }
  if (state === "locked") {
    return <LockKeyhole aria-hidden="true" className="h-4 w-4 text-landing-text-soft" />;
  }
  return null;
}

export function CourseCurriculumChapter({
  chapter,
  state,
  isExpanded,
  expandedLessonId,
  selectedMaterialId,
  lessonProgressMap,
  onToggleChapter,
  onToggleLesson,
  onSelectMaterial,
}: CourseCurriculumChapterProps) {
  const navigate = useNavigate();
  const lessonsQuery = useChapterLessonsQuery(isExpanded ? chapter.id : null);
  const onSelectMaterialRef = useRef(onSelectMaterial);
  const autoSelectedLessonRef = useRef<number | null>(null);
  const isLocked = state === "locked";

  onSelectMaterialRef.current = onSelectMaterial;

  useEffect(() => {
    autoSelectedLessonRef.current = null;
  }, [expandedLessonId]);

  useEffect(() => {
    if (!isExpanded || selectedMaterialId != null || expandedLessonId == null) {
      return;
    }
    if (autoSelectedLessonRef.current === expandedLessonId) {
      return;
    }

    const targetLesson = lessonsQuery.data?.find(
      (lesson) => lesson.id === expandedLessonId,
    );
    const firstMaterial = targetLesson?.materials[0];

    if (firstMaterial) {
      autoSelectedLessonRef.current = expandedLessonId;
      onSelectMaterialRef.current(firstMaterial, chapter.id);
    }
  }, [
    chapter.id,
    expandedLessonId,
    isExpanded,
    lessonsQuery.data,
    selectedMaterialId,
  ]);

  return (
    <div>
      <button
        aria-expanded={isExpanded}
        className={`w-full rounded-xl border p-3 text-left transition ${getChapterClassName(
          state,
          isExpanded,
        )}`}
        disabled={isLocked}
        onClick={onToggleChapter}
        type="button"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-label-sm font-semibold text-landing-red">
            Chương {chapter.orderIndex}
          </span>
          <div className="flex items-center gap-2">
            <ChapterStatus state={state} />
            {!isLocked ? (
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 text-landing-text-soft transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            ) : null}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-label-md font-semibold leading-6 text-landing-text">
          {chapter.title}
        </p>
      </button>

      {isExpanded ? (
        <div className="ml-3 space-y-2 border-l border-landing-red/15 py-3 pl-3">
          <button
            className="flex w-full items-center gap-3 rounded-xl bg-landing-red/5 px-3 py-2.5 text-left transition hover:bg-landing-red/10"
            onClick={() => navigate(`/student/chapters/${chapter.id}/flashcards`)}
            type="button"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-landing-white text-landing-red shadow-sm">
              <Layers3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-label-md font-semibold text-landing-text">
                Flashcard chương
              </span>
              <span className="text-label-sm text-landing-text-soft">Ôn tập bằng thẻ ghi nhớ</span>
            </span>
          </button>

          {lessonsQuery.isLoading ? (
            <>
              <div className="h-12 animate-pulse rounded-xl bg-landing-gray" />
              <div className="h-12 animate-pulse rounded-xl bg-landing-gray" />
            </>
          ) : null}

          {lessonsQuery.isError ? (
            <div className="rounded-xl border border-error/30 bg-error-container/30 p-3">
              <p className="text-label-sm text-error">Không tải được bài học.</p>
              <button
                className="mt-1 text-label-sm font-semibold text-error underline"
                onClick={() => lessonsQuery.refetch()}
                type="button"
              >
                Thử lại
              </button>
            </div>
          ) : null}

          {!lessonsQuery.isLoading && !lessonsQuery.isError
            ? lessonsQuery.data?.map((lesson) => {
                const isLessonExpanded = expandedLessonId === lesson.id;
                const lessonStatus =
                  lessonProgressMap.get(lesson.id)?.status ?? "NOT_STARTED";

                return (
                  <div
                    className={
                      isLessonExpanded
                        ? "overflow-hidden rounded-xl border border-landing-red/20 bg-landing-white"
                        : "overflow-hidden rounded-xl border border-outline-variant/30 bg-landing-white"
                    }
                    key={lesson.id}
                  >
                    <button
                      aria-expanded={isLessonExpanded}
                      className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition hover:bg-landing-gray/60"
                      onClick={() => onToggleLesson(chapter.id, lesson.id)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-label-md font-semibold text-landing-text">
                            {lesson.title || "Bài học chưa đặt tên"}
                          </span>
                          <LessonProgressStatusBadge status={lessonStatus} />
                        </span>
                        <span className="text-label-sm text-landing-text-soft">
                          {lesson.materials.length > 0
                            ? `${lesson.materials.length} tài liệu`
                            : "Chưa có tài liệu"}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 text-landing-text-soft transition-transform ${
                          isLessonExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isLessonExpanded ? (
                      <div className="space-y-1 border-t border-outline-variant/20 p-2">
                        <button
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-landing-red/5"
                          onClick={() => navigate(`/student/lessons/${lesson.id}/mindmap`)}
                          type="button"
                        >
                          <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-landing-red/5 text-landing-red">
                            <BrainCircuit aria-hidden="true" className="h-5 w-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-label-md font-medium text-landing-text">
                              Sơ đồ tư duy bài học
                            </span>
                            <span className="text-label-sm text-landing-text-soft">
                              Xem cấu trúc kiến thức
                            </span>
                          </span>
                        </button>

                        {lesson.materials.map((material) => {
                          const isActive = selectedMaterialId === material.id;

                          return (
                            <button
                              className={
                                isActive
                                  ? "flex w-full items-center gap-3 rounded-lg bg-landing-red/10 px-2 py-2 text-left"
                                  : "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-landing-gray"
                              }
                              key={material.id}
                              onClick={() => onSelectMaterial(material, chapter.id)}
                              type="button"
                            >
                              <CourseMaterialThumbnail
                                className="h-10 w-14"
                                contentType={material.contentType}
                                previewImageUrl={material.previewImageUrl}
                                title={material.title}
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-label-md font-medium text-landing-text">
                                  {material.title}
                                </span>
                                <span className="text-label-sm text-landing-text-soft">
                                  {getMaterialTypeLabel(material.contentType)}
                                  {material.slideCount
                                    ? ` · ${material.slideCount} slide`
                                    : ""}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}

          {!lessonsQuery.isLoading &&
          !lessonsQuery.isError &&
          (lessonsQuery.data?.length ?? 0) === 0 ? (
            <p className="rounded-xl bg-landing-gray p-3 text-label-sm text-landing-text-soft">
              Chưa có bài học trong chương này.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
