import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherSubjectsQuery } from "../../course-structure/hooks/use-course-structure-queries";
import { SubjectDocumentShell } from "./subject-document-shell";
import { SubjectDocumentSubjectCard } from "./subject-document-subject-card";

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

export function SubjectDocumentSubjectGrid() {
  const subjectsQuery = useTeacherSubjectsQuery();
  const subjects = subjectsQuery.data ?? [];

  return (
    <SubjectDocumentShell>
      <div className="space-y-md">
        <header className="border-b border-outline-variant/25 pb-6">
          <h1 className="text-headline-lg font-bold text-landing-text">Tài liệu học tập</h1>
          <p className="mt-1 max-w-2xl text-body-md text-landing-text-soft">
            Chọn môn học để tải giáo trình, bài đọc, nhiệm vụ và hướng dẫn trong môn đó.
          </p>
        </header>

        {subjectsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SubjectSkeleton />
          </div>
        ) : null}

        {subjectsQuery.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/40 p-gutter">
            <p className="text-body-md font-medium text-error">
              Không thể tải danh sách môn học.
            </p>
            <button
              className="mt-3 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep"
              onClick={() => subjectsQuery.refetch()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!subjectsQuery.isLoading && !subjectsQuery.isError && subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/25 p-lg text-center">
            <MaterialIcon className="mx-auto mb-3 text-[36px] text-catalog-cobalt/70">
              menu_book
            </MaterialIcon>
            <p className="text-body-md text-landing-text-soft">
              Chưa có môn học. Tạo môn trong Cấu trúc khóa học trước khi thêm tài liệu.
            </p>
          </div>
        ) : null}

        {!subjectsQuery.isLoading && !subjectsQuery.isError && subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject) => (
              <SubjectDocumentSubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : null}
      </div>
    </SubjectDocumentShell>
  );
}
