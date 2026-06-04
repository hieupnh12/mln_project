import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

export function ExamLoginBanner() {
  return (
    <aside className="mb-md box-border w-full min-w-0 rounded-xl border border-secondary-container bg-secondary-container/30 p-gutter">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-3">
          <MaterialIcon className="mt-0.5 text-secondary" size="sm">
            account_circle
          </MaterialIcon>
          <div className="text-left">
            <p className="text-base font-medium leading-snug text-primary">Đăng nhập để làm bài kiểm tra</p>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              Lịch sử nộp bài và làm lại khi chưa đạt chỉ hiển thị khi bạn đã đăng nhập.
            </p>
          </div>
        </div>
        <Link
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 sm:justify-self-end"
          to="/login"
        >
          Đăng nhập
        </Link>
      </div>
    </aside>
  );
}
