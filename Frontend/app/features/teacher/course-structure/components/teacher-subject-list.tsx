import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import { useTeacherSubjectsQuery } from "../hooks/use-course-structure-queries";

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

  return (
    <div className="mx-auto max-w-5xl" id="course-structure">
      <div className="mb-lg space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">Môn học tiếp nhận</h3>
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
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {(subjectsQuery.data ?? []).map((subject) => (
            <Link
              className="group flex min-h-40 flex-col justify-between rounded-2xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(35,39,51,0.08)]"
              key={subject.id}
              to={`${TEACHER_ROUTES.courses}/${subject.id}`}
            >
              <div>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
                  {subject.code}
                </span>
                <h4 className="mt-4 text-headline-md font-semibold text-primary group-hover:text-secondary">
                  {subject.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-label-md text-on-surface-variant">
                  {subject.description || "Chưa có mô tả"}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-label-md font-medium text-primary">
                Quản lý cấu trúc
                <MaterialIcon>arrow_forward</MaterialIcon>
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {!subjectsQuery.isLoading &&
      !subjectsQuery.isError &&
      (subjectsQuery.data?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-white p-gutter text-center">
          <MaterialIcon className="mx-auto mb-3 text-[40px] text-on-surface-variant">
            menu_book
          </MaterialIcon>
          <p className="text-headline-md font-semibold text-primary">Chưa có môn học nào</p>
        </div>
      ) : null}
    </div>
  );
}
