import { useState } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherSubjectsQuery } from "../hooks/use-course-structure-queries";
import { CourseStructureHeader } from "./course-structure-header";
import { NewSubjectCard } from "./subject-list/new-subject-card";
import { SubjectCard } from "./subject-list/subject-card";

function SubjectSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="min-h-52 animate-pulse rounded-2xl border border-outline-variant/20 bg-landing-gray/60"
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
    <div className="w-full space-y-md" id="course-structure">
      <CourseStructureHeader addDisabled={isCreating} onAddSubject={handleStartCreate} />

      {subjectsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SubjectSkeleton />
        </div>
      ) : null}

      {subjectsQuery.isError ? (
        <div className="rounded-2xl border border-error/30 bg-error-container/40 p-gutter">
          <p className="text-body-md font-medium text-error">Không thể tải danh sách môn học.</p>
          <button
            className="mt-3 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep"
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
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/25 p-gutter text-center">
              <MaterialIcon className="mx-auto mb-3 text-[40px] text-catalog-cobalt/70">menu_book</MaterialIcon>
              <p className="text-headline-md font-semibold text-landing-text">Chưa có môn học nào</p>
              <p className="mt-2 text-label-md text-landing-text-soft">
                Nhấn &quot;Thêm môn học&quot; để tạo môn đầu tiên.
              </p>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep"
                onClick={handleStartCreate}
                type="button"
              >
                <MaterialIcon>add</MaterialIcon>
                Thêm môn học
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
