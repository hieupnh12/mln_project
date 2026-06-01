import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizFilters } from "../types/quiz-management.types";
import type { QuizListSummary } from "../utils/quiz-ui.helpers";

type QuizListSummaryCardsProps = {
  activeStatus: QuizFilters["status"];
  onStatusFilter: (status: QuizFilters["status"]) => void;
  summary: QuizListSummary;
};

export function QuizListSummaryCards({
  activeStatus,
  onStatusFilter,
  summary,
}: QuizListSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon="quiz"
        iconClassName="bg-primary text-on-primary"
        label="Tổng quiz"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={
          <>
            {summary.total}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">bài</span>
          </>
        }
      />
      <SummaryCard
        icon="edit_note"
        iconClassName="bg-surface-container-high text-on-surface-variant"
        label="Bản nháp"
        onClick={() => onStatusFilter("Bản nháp")}
        selected={activeStatus === "Bản nháp"}
        value={
          <>
            {summary.draftCount}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">đang soạn</span>
          </>
        }
      />
      <SummaryCard
        icon="published_with_changes"
        iconClassName="bg-secondary-container text-primary"
        label="Đã xuất bản"
        onClick={() => onStatusFilter("Đã xuất bản")}
        selected={activeStatus === "Đã xuất bản"}
        value={
          <>
            {summary.publishedCount}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">live</span>
          </>
        }
      />
      <SummaryCard
        icon="schedule"
        iconClassName="bg-secondary-fixed text-secondary"
        label="Trung bình thời gian"
        value={
          <>
            {summary.avgDuration}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">
              phút · {summary.totalQuestions} câu tổng
            </span>
          </>
        }
      />
    </div>
  );
}

function SummaryCard({
  icon,
  iconClassName,
  label,
  onClick,
  selected = false,
  value,
}: {
  icon: string;
  iconClassName: string;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  value: ReactNode;
}) {
  const interactive = Boolean(onClick);

  return (
    <button
      className={`flex w-full items-start gap-sm rounded-xl border p-md text-left transition ${
        selected
          ? "border-secondary bg-secondary-container/30 shadow-sm"
          : "border-outline-variant/20 bg-white hover:border-outline-variant/40 hover:shadow-sm"
      } ${interactive ? "cursor-pointer" : "cursor-default"}`}
      disabled={!interactive}
      onClick={onClick}
      type="button"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <MaterialIcon>{icon}</MaterialIcon>
      </span>
      <div className="min-w-0">
        <p className="text-label-md font-medium text-on-surface-variant">{label}</p>
        <p className="mt-1 text-headline-md font-semibold text-primary">{value}</p>
      </div>
    </button>
  );
}

export function QuizListQuickTips() {
  return (
    <aside className="rounded-xl border border-outline-variant/20 bg-white p-md shadow-sm">
      <div className="mb-sm flex items-center gap-2 text-secondary">
        <MaterialIcon>tips_and_updates</MaterialIcon>
        <h4 className="text-label-md font-semibold uppercase tracking-wide text-primary">
          Quy trình nhanh
        </h4>
      </div>
      <ol className="space-y-2 text-body-md text-on-surface-variant">
        <li className="flex gap-2">
          <span className="font-semibold text-primary">1.</span>
          Tạo quiz mới hoặc mở bản nháp từ bảng.
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-primary">2.</span>
          Cài đặt phạm vi môn/chương, thời gian và điểm đạt.
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-primary">3.</span>
          Chọn câu hỏi hoặc random — xem trước rồi xuất bản.
        </li>
      </ol>
    </aside>
  );
}
