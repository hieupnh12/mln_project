import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { COURSE_STRUCTURE_QUERY_KEYS } from "../constants/course-structure-api.constants";
import { getStructureLessons } from "../services/course-structure.service";

import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { MaterialIcon } from "../../components/teacher-icons";
import { TeacherVisualGrid } from "../../components/teacher-visual-grid";
import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import {
  useCreateChapterMutation,
  useDeleteChapterMutation,
  useUpdateChapterMutation,
} from "../hooks/use-course-structure-mutations";
import {
  useStructureChaptersQuery,
  useTeacherSubjectQuery,
} from "../hooks/use-course-structure-queries";
import type { CourseStructureChapter, DeleteTarget } from "../types/course-structure.types";
import { ChapterAccordion } from "./chapter-accordion";
import { ConfirmDeleteModal } from "./modals/confirm-delete-modal";
import { NameFormModal } from "./modals/name-form-modal";

type CourseStructureManagerProps = {
  subjectId: number;
};

export function CourseStructureManager({ subjectId }: CourseStructureManagerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterParam = searchParams.get("chapter");
  const activeChapterId = chapterParam ? Number(chapterParam) : null;
  const [createChapterOpen, setCreateChapterOpen] = useState(false);
  const [editChapter, setEditChapter] = useState<CourseStructureChapter | null>(null);
  const [deleteChapterTarget, setDeleteChapterTarget] = useState<DeleteTarget | null>(null);

  const subjectQuery = useTeacherSubjectQuery(subjectId);
  const chaptersQuery = useStructureChaptersQuery(subjectId);

  const createChapterMutation = useCreateChapterMutation(subjectId);
  const updateChapterMutation = useUpdateChapterMutation(subjectId);
  const deleteChapterMutation = useDeleteChapterMutation(subjectId);

  async function handleCreateChapter(title: string) {
    try {
      await createChapterMutation.mutateAsync({ title, subjectId });
      showSuccessToast("Đã thêm chương mới.");
      setCreateChapterOpen(false);
    } catch {
      showErrorToast("Không thể thêm chương.");
    }
  }

  async function handleUpdateChapter(title: string) {
    if (!editChapter) return;

    try {
      await updateChapterMutation.mutateAsync({
        chapterId: editChapter.id,
        payload: { title },
      });
      showSuccessToast("Đã cập nhật chương.");
      setEditChapter(null);
    } catch {
      showErrorToast("Không thể cập nhật chương.");
    }
  }

  async function handleDeleteChapter() {
    if (deleteChapterTarget?.type !== "chapter") return;

    try {
      await deleteChapterMutation.mutateAsync(deleteChapterTarget.id);
      if (activeChapterId === deleteChapterTarget.id) {
        searchParams.delete("chapter");
        setSearchParams(searchParams, { replace: true });
      }
      showSuccessToast("Đã xóa chương và toàn bộ bài học/tài liệu bên trong.");
      setDeleteChapterTarget(null);
    } catch {
      showErrorToast("Không thể xóa chương.");
    }
  }

  const subject = subjectQuery.data;
  const chapters = chaptersQuery.data ?? [];

  const queryClient = useQueryClient();

  useEffect(() => {
    if (chapters.length > 0) {
      chapters.forEach((chapter) => {
        queryClient.prefetchQuery({
          queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapter.id),
          queryFn: () => getStructureLessons(chapter.id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [chapters, queryClient]);

  return (
    <div className="w-full" id="course-structure">
      <Link
        className="mb-md inline-flex items-center gap-1 rounded-xl border border-outline-variant/35 bg-landing-gray/40 px-3 py-1.5 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray/70 hover:text-landing-text"
        to={TEACHER_ROUTES.courses}
      >
        <MaterialIcon>arrow_back</MaterialIcon>
        Danh sách môn học
      </Link>

      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-landing-text">
            Quản lý Chương & Bài học
          </h3>
          <p className="text-body-md text-landing-text-soft">
            {subjectQuery.isLoading
              ? "Đang tải thông tin môn..."
              : `${subject?.title ?? "Môn học"} · Tổ chức lộ trình học tập trực quan.`}
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center gap-sm rounded-xl bg-landing-red px-md py-sm font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-95 sm:w-auto"
          onClick={() => setCreateChapterOpen(true)}
          type="button"
        >
          <MaterialIcon>add_circle</MaterialIcon>
          <span className="text-label-md font-medium">Thêm chương mới</span>
        </button>
      </div>

      {chaptersQuery.isLoading ? (
        <div className="space-y-md">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="h-24 animate-pulse rounded-2xl bg-landing-gray/70" key={index} />
          ))}
        </div>
      ) : null}

      {chaptersQuery.isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
          <p className="text-body-md text-error">Không thể tải cấu trúc khóa học.</p>
          <button
            className="mt-3 rounded-lg bg-landing-red px-5 py-2 text-label-md font-medium text-on-primary"
            onClick={() => chaptersQuery.refetch()}
            type="button"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!chaptersQuery.isLoading && !chaptersQuery.isError ? (
        chapters.length > 0 ? (
          <ChapterAccordion
            activeChapterId={activeChapterId}
            chapters={chapters}
            onDeleteChapter={setDeleteChapterTarget}
            onEditChapter={setEditChapter}
            onToggleChapter={(chapterId) => {
              if (activeChapterId === chapterId) {
                searchParams.delete("chapter");
              } else {
                searchParams.set("chapter", String(chapterId));
              }
              setSearchParams(searchParams, { replace: true });
            }}
            subjectId={subjectId}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/25 p-xl text-center">
            <MaterialIcon className="mx-auto mb-3 text-[40px] text-catalog-cobalt/70">
              account_tree
            </MaterialIcon>
            <p className="text-headline-md font-semibold text-landing-text">Chưa có chương nào</p>
            <p className="mt-2 text-body-md text-landing-text-soft">
              Bắt đầu bằng cách thêm chương đầu tiên cho môn học này.
            </p>
          </div>
        )
      ) : null}

      <section className="mt-xl flex flex-col gap-4 overflow-hidden rounded-2xl border border-outline-variant/25 bg-landing-gray/30 p-lg md:flex-row md:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-landing-gold/15 text-landing-text-muted">
          <MaterialIcon>lightbulb</MaterialIcon>
        </div>
        <div className="flex-1">
          <h5 className="mb-1 text-headline-sm font-semibold text-landing-text">Mẹo quản lý khóa học</h5>
          <p className="text-body-md leading-relaxed text-landing-text-soft">
            Chia nhỏ các bài học thành các chương từ 15-20 phút giúp sinh viên duy trì sự tập
            trung cao độ và ghi nhớ kiến thức tốt hơn.
          </p>
        </div>
      </section>

      <TeacherVisualGrid />

      <NameFormModal
        isPending={createChapterMutation.isPending}
        label="Tên chương"
        onClose={() => setCreateChapterOpen(false)}
        onSubmit={handleCreateChapter}
        open={createChapterOpen}
        submitLabel="Thêm chương"
        title="Thêm chương mới"
      />

      <NameFormModal
        initialValue={editChapter?.title ?? ""}
        isPending={updateChapterMutation.isPending}
        label="Tên chương"
        onClose={() => setEditChapter(null)}
        onSubmit={handleUpdateChapter}
        open={editChapter != null}
        submitLabel="Lưu"
        title="Sửa chương"
      />

      {deleteChapterTarget?.type === "chapter" ? (
        <ConfirmDeleteModal
          description="Xóa chương sẽ xóa toàn bộ bài học và tài liệu bên trong. Hành động này không thể hoàn tác."
          isPending={deleteChapterMutation.isPending}
          onClose={() => setDeleteChapterTarget(null)}
          onConfirm={handleDeleteChapter}
          open
          title={`Xóa chương "${deleteChapterTarget.title}"?`}
        />
      ) : null}
    </div>
  );
}
