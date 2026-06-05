import { useState } from "react";
import { Link, useSearchParams } from "react-router";

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

  return (
    <div className="mx-auto max-w-5xl" id="course-structure">
      <Link
        className="mb-md inline-flex items-center gap-1 text-label-md font-medium text-secondary transition hover:text-primary"
        to={TEACHER_ROUTES.courses}
      >
        <MaterialIcon>arrow_back</MaterialIcon>
        Danh sách môn học
      </Link>

      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-primary">
            Quản lý Chương & Bài học
          </h3>
          <p className="text-body-md text-on-surface-variant">
            {subjectQuery.isLoading
              ? "Đang tải thông tin môn..."
              : `${subject?.title ?? "Môn học"} · Tổ chức lộ trình học tập trực quan.`}
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm transition hover:shadow-md active:scale-95 sm:w-auto"
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
            <div className="h-24 animate-pulse rounded-2xl bg-surface-container-low" key={index} />
          ))}
        </div>
      ) : null}

      {chaptersQuery.isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
          <p className="text-body-md text-error">Không thể tải cấu trúc khóa học.</p>
          <button
            className="mt-3 rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary"
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
          <div className="rounded-2xl border border-outline-variant/20 bg-white p-xl text-center shadow-sm">
            <MaterialIcon className="mx-auto mb-3 text-[40px] text-on-surface-variant">
              account_tree
            </MaterialIcon>
            <p className="text-headline-md font-semibold text-primary">Chưa có chương nào</p>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Bắt đầu bằng cách thêm chương đầu tiên cho môn học này.
            </p>
          </div>
        )
      ) : null}

      <section className="mt-xl flex flex-col gap-lg rounded-2xl border-l-[8px] border-secondary-container bg-primary-container p-lg text-white shadow-lg md:flex-row md:items-center">
        <div className="flex-1">
          <h5 className="mb-xs text-headline-md font-semibold">Mẹo quản lý khóa học</h5>
          <p className="text-body-md leading-relaxed opacity-80">
            Chia nhỏ các bài học thành các chương từ 15-20 phút giúp sinh viên duy trì sự tập
            trung cao độ và ghi nhớ kiến thức tốt hơn.
          </p>
        </div>
        <MaterialIcon className="hidden h-16 w-16 text-[64px] text-secondary-container md:inline-flex">
          lightbulb
        </MaterialIcon>
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
