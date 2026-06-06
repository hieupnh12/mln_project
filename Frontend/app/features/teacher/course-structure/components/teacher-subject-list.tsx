import { useState } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherSubjectsQuery } from "../hooks/use-course-structure-queries";
import { NewSubjectCard } from "./subject-list/new-subject-card";
import { SubjectCard } from "./subject-list/subject-card";

function SubjectSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="min-h-40 animate-pulse rounded-2xl border border-outline-variant/20 bg-surface-container-low"
          key={index}
        />
      ))}
    </>
  );
}

export function TeacherSubjectList() {
  const subjectsQuery = useTeacherSubjectsQuery();
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const subjects = subjectsQuery.data ?? [];
  const hasSubjects = subjects.length > 0;

  const handleStartCreate = () => {
    setEditingSubjectId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (subjectId: number) => {
    setIsCreating(false);
    setEditingSubjectId(subjectId);
  };

  return (
    <div className="mx-auto max-w-5xl" id="course-structure">
      <div className="mb-lg space-y-xs">
        <div className="flex items-center gap-4">
          <h3 className="text-headline-lg font-semibold text-primary">Môn học tiếp nhận</h3>
          {!subjectsQuery.isLoading && !subjectsQuery.isError ? (
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-[0_4px_20px_rgba(35,39,51,0.05)] transition hover:scale-105"
              disabled={isCreating}
              onClick={handleStartCreate}
              title="Thêm môn học mới"
              type="button"
            >
              <MaterialIcon>add</MaterialIcon>
            </button>
          ) : null}
        </div>
        <p className="text-body-md text-on-surface-variant">
          Chọn môn để quản lý cấu trúc khóa học: chương, bài học và tài liệu.
        </p>
      </div>

      {subjectsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          <SubjectSkeleton />
        </div>
      ) : null}

      {subjectsQuery.isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
          <p className="text-body-md font-medium text-error">Không thể tải danh sách môn học.</p>
          <button
            className="mt-3 rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary"
            onClick={() => subjectsQuery.refetch()}
            type="button"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!subjectsQuery.isLoading && !subjectsQuery.isError ? (
        <>
          {(hasSubjects || isCreating) && (
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {isCreating ? (
                <NewSubjectCard
                  onCancel={() => setIsCreating(false)}
                  onCreated={() => setIsCreating(false)}
                />
              ) : null}

              {subjects.map((subject) => (
                <SubjectCard
                  isEditing={editingSubjectId === subject.id}
                  key={subject.id}
                  onCancelEdit={() => setEditingSubjectId(null)}
                  onStartEdit={() => handleStartEdit(subject.id)}
                  subject={subject}
                />
              ))}
            </div>
          )}

          {!hasSubjects && !isCreating ? (
            <div className="rounded-xl border border-outline-variant bg-white p-gutter text-center">
              <MaterialIcon className="mx-auto mb-3 text-[40px] text-on-surface-variant">
                menu_book
              </MaterialIcon>
              <p className="text-headline-md font-semibold text-primary">Chưa có môn học nào</p>
              <p className="mt-2 text-label-md text-on-surface-variant">
                Nhấn nút thêm để tạo môn học đầu tiên.
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
