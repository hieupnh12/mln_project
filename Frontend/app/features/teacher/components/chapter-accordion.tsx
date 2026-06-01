import { useState } from "react";

import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { MaterialIcon } from "../../components/teacher-icons";
import {
  useCreateLessonMutation,
  useCreateMaterialMutation,
  useDeleteLessonMutation,
  useDeleteMaterialMutation,
  useUpdateLessonMutation,
} from "../hooks/use-course-structure-mutations";
import { useStructureLessonsQuery } from "../hooks/use-course-structure-queries";
import type {
  CourseStructureChapter,
  CourseStructureLesson,
  CourseStructureMaterial,
  DeleteTarget,
} from "../types/course-structure.types";
import { getMaterialTypeLabel } from "../utils/map-course-structure-dto";
import { CreateMaterialModal } from "./modals/create-material-modal";
import { MaterialPreviewModal } from "./modals/material-preview-modal";
import { ConfirmDeleteModal } from "./modals/confirm-delete-modal";
import { NameFormModal } from "./modals/name-form-modal";
import { MaterialThumbnail } from "./material-preview/material-thumbnail";

type ChapterAccordionProps = {
  subjectId: number;
  chapters: CourseStructureChapter[];
  activeChapterId: number | null;
  onToggleChapter: (chapterId: number) => void;
  onEditChapter: (chapter: CourseStructureChapter) => void;
  onDeleteChapter: (target: DeleteTarget) => void;
};

type ChapterBlockProps = {
  subjectId: number;
  chapter: CourseStructureChapter;
  isActive: boolean;
  onToggle: () => void;
  onEditChapter: () => void;
  onDeleteChapter: () => void;
  onDeleteLesson: (target: DeleteTarget) => void;
  onDeleteMaterial: (target: DeleteTarget) => void;
};

function IconButton({
  danger = false,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`rounded-lg p-base transition ${
        danger
          ? "text-on-surface-variant hover:bg-error-container/20 hover:text-error"
          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <MaterialIcon>{icon}</MaterialIcon>
    </button>
  );
}

function MaterialRow({
  material,
  onPreview,
  onDelete,
}: {
  material: CourseStructureMaterial;
  onPreview: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-sm rounded-lg px-sm py-1.5 transition hover:bg-surface-container-lowest">
      <button
        aria-label={`Xem trước ${material.title}`}
        className="flex min-w-0 flex-1 items-center gap-sm text-left"
        onClick={onPreview}
        type="button"
      >
        <MaterialThumbnail className="h-12 w-16" material={material} />
        <div className="min-w-0">
          <p className="truncate text-label-sm font-medium text-on-surface">{material.title}</p>
          <p className="text-[11px] text-on-surface-variant">
            {getMaterialTypeLabel(material.contentType)}
            {material.contentType === "SLIDE_DECK" && material.slideCount
              ? ` · ${material.slideCount} slide`
              : ""}
          </p>
        </div>
      </button>
      <button
        aria-label="Xóa tài liệu"
        className="shrink-0 p-xs text-on-surface-variant opacity-100 transition hover:text-error sm:opacity-0 sm:group-hover:opacity-100"
        onClick={onDelete}
        type="button"
      >
        <MaterialIcon className="h-4 w-4 text-[16px]">delete</MaterialIcon>
      </button>
    </div>
  );
}

function LessonBlock({
  chapterId,
  lesson,
  onDeleteLesson,
  onDeleteMaterial,
}: {
  chapterId: number;
  lesson: CourseStructureLesson;
  onDeleteLesson: (target: DeleteTarget) => void;
  onDeleteMaterial: (target: DeleteTarget) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<CourseStructureMaterial | null>(null);
  const updateMutation = useUpdateLessonMutation(chapterId);
  const createMaterialMutation = useCreateMaterialMutation(chapterId);

  const materialCount = lesson.materials.length;

  async function handleUpdateTitle(title: string) {
    try {
      await updateMutation.mutateAsync({ lessonId: lesson.id, payload: { title } });
      showSuccessToast("Đã cập nhật bài học.");
      setEditOpen(false);
    } catch {
      showErrorToast("Không thể cập nhật bài học.");
    }
  }

  function handleToggleExpanded() {
    setIsExpanded((current) => !current);
  }

  return (
    <>
      <div className="group rounded-xl border border-outline-variant/15 bg-surface-container-lowest/60 p-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            aria-expanded={isExpanded}
            className="flex min-w-0 flex-1 items-center gap-md text-left"
            onClick={handleToggleExpanded}
            type="button"
          >
            <MaterialIcon className="text-outline-variant">drag_indicator</MaterialIcon>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container/30 text-on-secondary-container">
              <MaterialIcon className="h-[18px] w-[18px] text-[18px]">menu_book</MaterialIcon>
            </div>
            <div className="min-w-0 flex-1">
              <span className="break-words text-label-md font-medium text-on-surface">
                {lesson.title}
              </span>
              <p className="text-label-sm text-on-surface-variant">
                {lesson.teacherName}
                {materialCount > 0
                  ? ` · ${materialCount} tài liệu`
                  : " · Chưa có tài liệu"}
              </p>
            </div>
            <MaterialIcon
              className={`shrink-0 text-on-surface-variant transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              expand_more
            </MaterialIcon>
          </button>
          <div className="flex flex-wrap items-center gap-base opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              className="inline-flex items-center gap-1 rounded-lg bg-secondary-container/40 px-sm py-xs text-label-sm font-semibold text-primary"
              onClick={() => setMaterialOpen(true)}
              type="button"
            >
              <MaterialIcon className="h-4 w-4 text-[16px]">add</MaterialIcon>
              Tài liệu
            </button>
            <button className="p-xs transition hover:text-primary" onClick={() => setEditOpen(true)} type="button">
              <MaterialIcon className="h-5 w-5 text-[20px]">edit</MaterialIcon>
            </button>
            <button
              className="p-xs transition hover:text-error"
              onClick={() =>
                onDeleteLesson({
                  type: "lesson",
                  id: lesson.id,
                  title: lesson.title,
                  chapterId,
                })
              }
              type="button"
            >
              <MaterialIcon className="h-5 w-5 text-[20px]">delete</MaterialIcon>
            </button>
          </div>
        </div>

        {isExpanded ? (
          materialCount > 0 ? (
            <div className="mt-sm space-y-1 border-t border-outline-variant/15 pt-sm">
              {lesson.materials.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  onDelete={() =>
                    onDeleteMaterial({
                      type: "material",
                      id: material.id,
                      title: material.title,
                      lessonId: lesson.id,
                    })
                  }
                  onPreview={() => setPreviewMaterial(material)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-sm border-t border-outline-variant/15 pt-sm text-label-sm italic text-on-surface-variant/70">
              Chưa có tài liệu. Nhấn &quot;Tài liệu&quot; để thêm slide hoặc YouTube.
            </p>
          )
        ) : null}
      </div>

      <NameFormModal
        initialValue={lesson.title}
        isPending={updateMutation.isPending}
        label="Tên bài học"
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdateTitle}
        open={editOpen}
        submitLabel="Lưu"
        title="Sửa bài học"
      />

      <CreateMaterialModal
        isPending={createMaterialMutation.isPending}
        lessonTitle={lesson.title}
        onClose={() => setMaterialOpen(false)}
        onSubmit={async (payload) => {
          await createMaterialMutation.mutateAsync({
            lessonId: lesson.id,
            payload: {
              title: payload.title,
              youtubeUrl: payload.youtubeUrl,
              files: payload.files,
            },
          });
        }}
        open={materialOpen}
      />

      <MaterialPreviewModal
        material={previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        open={previewMaterial != null}
      />
    </>
  );
}

function ChapterBlock({
  subjectId,
  chapter,
  isActive,
  onToggle,
  onEditChapter,
  onDeleteChapter,
  onDeleteLesson,
  onDeleteMaterial,
}: ChapterBlockProps) {
  const [createLessonOpen, setCreateLessonOpen] = useState(false);
  const lessonsQuery = useStructureLessonsQuery(isActive ? chapter.id : null);
  const createLessonMutation = useCreateLessonMutation(chapter.id, subjectId);

  async function handleCreateLesson(title: string) {
    try {
      await createLessonMutation.mutateAsync({ title });
      showSuccessToast("Đã thêm bài học.");
      setCreateLessonOpen(false);
    } catch {
      showErrorToast("Không thể thêm bài học.");
    }
  }

  const lessonCount = lessonsQuery.data?.length ?? 0;

  return (
    <>
      <article className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(35,39,51,0.06)]">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="flex min-w-0 flex-1 items-center gap-md text-left"
            onClick={onToggle}
            type="button"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-headline-md font-bold text-primary-container">
              {chapter.orderLabel}
            </div>
            <div className="min-w-0">
              <h4 className="break-words text-headline-md font-semibold text-primary">
                {chapter.title}
              </h4>
              <p className="text-label-sm font-semibold text-on-surface-variant">
                {isActive && !lessonsQuery.isLoading
                  ? `${lessonCount} bài học`
                  : "Nhấn để xem bài học"}
              </p>
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-sm sm:justify-end">
            <IconButton icon="edit" label="Sửa chương" onClick={onEditChapter} />
            <IconButton danger icon="delete" label="Xóa chương" onClick={onDeleteChapter} />
            <span className="hidden h-6 w-px bg-outline-variant/30 sm:block" />
            <button
              className="inline-flex items-center gap-xs rounded-lg bg-outline-variant/10 px-sm py-xs text-label-sm font-semibold text-primary"
              onClick={() => setCreateLessonOpen(true)}
              type="button"
            >
              <MaterialIcon className="h-5 w-5 text-[20px]">add</MaterialIcon>
              Thêm bài học
            </button>
            <button aria-label="Mở rộng chương" onClick={onToggle} type="button">
              <MaterialIcon
                className={`text-on-surface-variant transition-transform ${
                  isActive ? "rotate-180" : ""
                }`}
              >
                expand_more
              </MaterialIcon>
            </button>
          </div>
        </div>

        {isActive ? (
          <div className="mt-md border-t border-outline-variant/20 pt-md">
            {lessonsQuery.isLoading ? (
              <div className="space-y-xs">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div className="h-16 animate-pulse rounded-xl bg-surface-container-low" key={index} />
                ))}
              </div>
            ) : null}

            {lessonsQuery.isError ? (
              <p className="text-label-md text-error">Không tải được bài học.</p>
            ) : null}

            {!lessonsQuery.isLoading && !lessonsQuery.isError ? (
              (lessonsQuery.data?.length ?? 0) > 0 ? (
                <div className="space-y-xs">
                  {(lessonsQuery.data ?? []).map((lesson) => (
                    <LessonBlock
                      chapterId={chapter.id}
                      key={lesson.id}
                      lesson={lesson}
                      onDeleteLesson={onDeleteLesson}
                      onDeleteMaterial={onDeleteMaterial}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-surface-container-low p-xl text-center text-label-md font-medium italic text-on-surface-variant/60">
                  Chưa có bài học. Hãy thêm bài học đầu tiên!
                </div>
              )
            ) : null}
          </div>
        ) : null}
      </article>

      <NameFormModal
        isPending={createLessonMutation.isPending}
        label="Tên bài học"
        onClose={() => setCreateLessonOpen(false)}
        onSubmit={handleCreateLesson}
        open={createLessonOpen}
        submitLabel="Thêm"
        title="Thêm bài học mới"
      />
    </>
  );
}

export function ChapterAccordion({
  subjectId,
  chapters,
  activeChapterId,
  onToggleChapter,
  onEditChapter,
  onDeleteChapter,
}: ChapterAccordionProps) {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const lessonChapterId =
    deleteTarget?.type === "lesson" ? deleteTarget.chapterId : activeChapterId ?? 0;

  const deleteLessonMutation = useDeleteLessonMutation(lessonChapterId, subjectId);
  const deleteMaterialMutation = useDeleteMaterialMutation(activeChapterId ?? 0);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "lesson") {
        await deleteLessonMutation.mutateAsync(deleteTarget.id);
      } else if (deleteTarget.type === "material") {
        await deleteMaterialMutation.mutateAsync(deleteTarget.id);
      }
      showSuccessToast("Đã xóa thành công.");
      setDeleteTarget(null);
    } catch {
      showErrorToast("Không thể xóa. Vui lòng thử lại.");
    }
  }

  const deleteDescription =
    deleteTarget?.type === "lesson"
      ? "Xóa bài học sẽ xóa luôn tất cả tài liệu bên trong. Hành động này không thể hoàn tác."
      : "Xóa tài liệu sẽ xóa slide hoặc video liên quan. Hành động này không thể hoàn tác.";

  return (
    <>
      <div className="space-y-md">
        {chapters.map((chapter) => (
          <ChapterBlock
            chapter={chapter}
            isActive={activeChapterId === chapter.id}
            key={chapter.id}
            onDeleteChapter={() =>
              onDeleteChapter({ type: "chapter", id: chapter.id, title: chapter.title })
            }
            onDeleteLesson={setDeleteTarget}
            onDeleteMaterial={setDeleteTarget}
            onEditChapter={() => onEditChapter(chapter)}
            onToggle={() => onToggleChapter(chapter.id)}
            subjectId={subjectId}
          />
        ))}
      </div>

      {deleteTarget?.type === "lesson" || deleteTarget?.type === "material" ? (
        <ConfirmDeleteModal
          description={deleteDescription}
          isPending={deleteLessonMutation.isPending || deleteMaterialMutation.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          open
          title={`Xóa "${deleteTarget.title}"?`}
        />
      ) : null}
    </>
  );
}
