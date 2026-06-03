import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { StudentChapterState } from "../../types/student.types";
import { showInfoToast } from "../../../../shared/utils/toast";
import {
  useChapterLessonsQuery,
  useCourseChaptersQuery,
  useMaterialDetailQuery,
} from "../hooks/use-course-learning-queries";
import type { CourseChapterItem, CourseMaterialSummary } from "../types/course-learning.types";
import { getChapterVisualState } from "../utils/get-chapter-visual-state";
import { getMaterialTypeLabel } from "../utils/resolve-course-cover-image";
import { CourseMaterialThumbnail } from "./course-material-thumbnail";

type CourseCurriculumSidebarProps = {
  subjectId: number;
  expandedChapterId: number | null;
  selectedMaterialId: number | null;
  onToggleChapter: (chapterId: number) => void;
  onSelectMaterial: (material: CourseMaterialSummary) => void;
};

function ChapterSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="h-16 animate-pulse rounded-lg bg-surface-container-low"
          key={index}
        />
      ))}
    </>
  );
}

type ChapterLessonsBlockProps = {
  chapterId: number;
  isExpanded: boolean;
  selectedMaterialId: number | null;
  onSelectMaterial: (material: CourseMaterialSummary) => void;
};

function ChapterLessonsBlock({
  chapterId,
  isExpanded,
  selectedMaterialId,
  onSelectMaterial,
}: ChapterLessonsBlockProps) {
  const navigate = useNavigate();
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const lessonsQuery = useChapterLessonsQuery(isExpanded ? chapterId : null);

  useEffect(() => {
    if (!isExpanded) {
      setExpandedLessonId(null);
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return null;
  }

  if (lessonsQuery.isLoading) {
    return (
      <div className="ml-3 space-y-2 border-l border-outline-variant/30 py-2 pl-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="h-10 animate-pulse rounded-md bg-surface-container-low" key={index} />
        ))}
      </div>
    );
  }

  if (lessonsQuery.isError) {
    return (
      <div className="ml-3 border-l border-error/30 py-2 pl-3">
        <p className="text-label-sm text-error">Không tải được bài học.</p>
        <button
          className="mt-1 text-label-sm font-medium text-primary underline"
          onClick={() => lessonsQuery.refetch()}
          type="button"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const lessons = lessonsQuery.data ?? [];

  if (lessons.length === 0) {
    return (
      <p className="ml-3 border-l border-outline-variant/30 py-2 pl-3 text-label-sm text-on-surface-variant">
        Chưa có bài học trong chương này.
      </p>
    );
  }

  return (
    <div className="ml-3 space-y-2 border-l border-outline-variant/30 py-2 pl-3">
      {lessons.map((lesson) => {
        const isLessonExpanded = expandedLessonId === lesson.id;
        const materialCount = lesson.materials.length;

        return (
          <div
            className={getLessonCardClassName(isLessonExpanded)}
            key={lesson.id}
          >
            <button
              aria-expanded={isLessonExpanded}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition hover:bg-surface-container-low/50"
              onClick={() =>
                setExpandedLessonId((current) => (current === lesson.id ? null : lesson.id))
              }
              type="button"
            >
              <span className="min-w-0">
                <span className="block truncate text-label-md font-semibold text-primary">
                  {lesson.title || "Bài học chưa đặt tên"}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  {materialCount > 0
                    ? `${materialCount} tài liệu`
                    : "Chưa có tài liệu"}
                </span>
              </span>
              <MaterialIcon
                className={`shrink-0 text-on-surface-variant transition-transform ${
                  isLessonExpanded ? "rotate-180" : ""
                }`}
              >
                expand_more
              </MaterialIcon>
            </button>

            {isLessonExpanded ? (
<<<<<<< HEAD
              materialCount > 0 ? (
                <ul className="space-y-1 border-t border-outline-variant/30 px-2 pb-2 pt-1">
                  {lesson.materials.map((material) => {
                    const isActive = selectedMaterialId === material.id;
=======
              <div className="mt-1 space-y-1 pl-2">
                {/* Sơ đồ tư duy bài học */}
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-surface-container-low"
                  onClick={() => navigate(`/student/lessons/${lesson.id}/mindmap`)}
                  type="button"
                >
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-secondary-container/30 text-secondary">
                    <MaterialIcon>hub</MaterialIcon>
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label-md font-medium text-primary">
                      Sơ đồ tư duy bài học
                    </span>
                    <span className="text-label-sm text-on-surface-variant">
                      Xem cấu trúc kiến thức
                    </span>
                  </span>
                </button>
>>>>>>> a19a03a477bb7e2d96b886cac5537e78d5093bce

                {materialCount > 0 ? (
                  <ul className="space-y-1">
                    {lesson.materials.map((material) => {
                      const isActive = selectedMaterialId === material.id;

                      return (
                        <li key={material.id}>
                          <button
                            className={
                              isActive
                                ? "flex w-full items-center gap-2 rounded-lg bg-secondary-container/40 px-3 py-2 text-left"
                                : "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-surface-container-low"
                            }
                            onClick={() => onSelectMaterial(material)}
                            type="button"
                          >
                            <CourseMaterialThumbnail
                              className="h-10 w-14"
                              contentType={material.contentType}
                              previewImageUrl={material.previewImageUrl}
                              title={material.title}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-label-md font-medium text-primary">
                                {material.title}
                              </span>
                              <span className="text-label-sm text-on-surface-variant">
                                {getMaterialTypeLabel(material.contentType)}
                                {material.slideCount
                                  ? ` · ${material.slideCount} slide`
                                  : ""}
                              </span>
                            </span>
<<<<<<< HEAD
                            <span className="text-label-sm text-on-surface-variant">
                              {getMaterialTypeLabel(material.contentType)}
                              {material.slideCount
                                ? ` · ${material.slideCount} slide`
                                : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="border-t border-outline-variant/30 px-3 pb-2 pt-1 text-label-sm text-on-surface-variant">
                  Chưa có tài liệu.
                </p>
              )
=======
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-1 pl-2 text-label-sm italic text-on-surface-variant/70">Chưa có tài liệu khác.</p>
                )}
              </div>
>>>>>>> a19a03a477bb7e2d96b886cac5537e78d5093bce
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function getLessonCardClassName(isExpanded: boolean): string {
  if (isExpanded) {
    return "overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-low transition-colors";
  }

  return "overflow-hidden rounded-lg border border-outline-variant/30 bg-white transition-all hover:border-outline-variant hover:bg-surface-container-low/50";
}

function getChapterCardClassName(state: StudentChapterState, isExpanded: boolean): string {
  if (state === "done") {
    return "w-full rounded-lg border border-secondary-container bg-secondary-container/30 p-3 text-left transition-colors";
  }

  if (state === "active" || isExpanded) {
    return "w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-surface-container-low p-3 text-left transition-colors hover:bg-secondary-container/10";
  }

  if (state === "locked") {
    return "w-full rounded-lg border border-outline-variant/30 p-3 text-left opacity-80";
  }

  return "w-full cursor-pointer rounded-lg border border-outline-variant/30 p-3 text-left transition-all hover:border-outline-variant hover:bg-surface-container-low/50";
}

function ChapterStatusBadge({ state }: { state: StudentChapterState }) {
  if (state === "done") {
    return (
      <MaterialIcon className="text-sm text-secondary" filled>
        check_circle
      </MaterialIcon>
    );
  }

  if (state === "active") {
    return (
      <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
        Đang học
      </span>
    );
  }

  if (state === "locked") {
    return <MaterialIcon className="text-sm text-outline">lock</MaterialIcon>;
  }

  return null;
}

function ChapterButton({
  chapter,
  state,
  isExpanded,
  onToggle,
}: {
  chapter: CourseChapterItem;
  state: StudentChapterState;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isLocked = state === "locked";
  const titleClassName =
    state === "locked" ? "text-sm leading-tight text-outline" : "text-sm leading-tight text-on-surface-variant";
  const labelClassName =
    state === "locked"
      ? "text-label-md font-medium text-on-surface-variant"
      : state === "open" && !isExpanded
        ? "text-label-md font-medium text-on-surface-variant"
        : "text-label-md font-medium text-primary";

  return (
    <button
      className={getChapterCardClassName(state, isExpanded)}
      disabled={isLocked}
      onClick={onToggle}
      type="button"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={labelClassName}>Chương {chapter.orderIndex}</span>
        <ChapterStatusBadge state={state} />
      </div>
      <p className={titleClassName}>{chapter.title}</p>
    </button>
  );
}

type DownloadMaterialButtonProps = {
  selectedMaterialId: number | null;
};

function DownloadMaterialButton({ selectedMaterialId }: DownloadMaterialButtonProps) {
  const materialQuery = useMaterialDetailQuery(selectedMaterialId);
  const resourceUrl = materialQuery.data?.resourceUrl ?? null;
  const isDisabled = selectedMaterialId == null || !resourceUrl || materialQuery.isLoading;

  function handleDownload() {
    if (!resourceUrl) {
      showInfoToast("Tài liệu này chưa có file PDF để tải.");
      return;
    }

    window.open(resourceUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      className="mt-md flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-label-md font-medium text-on-primary transition-all hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isDisabled}
      onClick={handleDownload}
      type="button"
    >
      <MaterialIcon>download</MaterialIcon>
      Tải tài liệu (PDF)
    </button>
  );
}

export function CourseCurriculumSidebar({
  subjectId,
  expandedChapterId,
  selectedMaterialId,
  onToggleChapter,
  onSelectMaterial,
}: CourseCurriculumSidebarProps) {
  const chaptersQuery = useCourseChaptersQuery(subjectId);
  const chapters = chaptersQuery.data ?? [];

  return (
    <aside className="flex h-full max-h-150 flex-col rounded-xl border border-outline-variant/30 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] lg:max-h-[600px]">
      <h3 className="mb-md flex items-center gap-2 text-label-md font-medium uppercase tracking-wider text-primary-container">
        <MaterialIcon className="text-secondary">list_alt</MaterialIcon>
        Nội dung chương trình
      </h3>

      <div className="hide-scrollbar flex-1 space-y-xs overflow-y-auto pr-1">
        {chaptersQuery.isLoading ? <ChapterSkeleton /> : null}

        {chaptersQuery.isError ? (
          <div className="rounded-lg border border-error/30 bg-error-container/30 p-3">
            <p className="text-label-md text-error">Không tải được danh sách chương.</p>
            <button
              className="mt-2 text-label-sm font-medium text-primary underline"
              onClick={() => chaptersQuery.refetch()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!chaptersQuery.isLoading && !chaptersQuery.isError
          ? chapters.map((chapter) => {
              const isExpanded = expandedChapterId === chapter.id;
              const state = getChapterVisualState(chapter, expandedChapterId, chapters);

              return (
                <div key={chapter.id}>
                  <ChapterButton
                    chapter={chapter}
                    isExpanded={isExpanded}
                    onToggle={() => onToggleChapter(chapter.id)}
                    state={state}
                  />
                  <ChapterLessonsBlock
                    chapterId={chapter.id}
                    isExpanded={isExpanded}
                    onSelectMaterial={onSelectMaterial}
                    selectedMaterialId={selectedMaterialId}
                  />
                </div>
              );
            })
          : null}

        {!chaptersQuery.isLoading &&
        !chaptersQuery.isError &&
        chapters.length === 0 ? (
          <p className="rounded-lg bg-surface-container-low p-3 text-label-md text-on-surface-variant">
            Chưa có chương nào cho môn học này.
          </p>
        ) : null}
      </div>

      <DownloadMaterialButton selectedMaterialId={selectedMaterialId} />
    </aside>
  );
}
