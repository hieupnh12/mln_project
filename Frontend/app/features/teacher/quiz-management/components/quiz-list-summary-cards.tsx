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
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="quiz"
        iconClassName="bg-primary-fixed text-primary"
        label="Tổng số quiz"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={
          <>
            {summary.total.toLocaleString("vi-VN")}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">quiz</span>
          </>
        }
      />
      <StatCard
        icon="edit_note"
        iconClassName="bg-secondary-container text-on-secondary-container"
        label="Bản nháp"
        onClick={() => onStatusFilter("Bản nháp")}
        selected={activeStatus === "Bản nháp"}
        value={
          <>
            {summary.draftCount}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">nháp</span>
          </>
        }
      />
      <StatCard
        icon="published_with_changes"
        iconClassName="bg-secondary-fixed text-secondary"
        label="Đang mở"
        onClick={() => onStatusFilter("Đã xuất bản")}
        selected={activeStatus === "Đã xuất bản"}
        value={
          <>
            {summary.publishedCount}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">live</span>
          </>
        }
      />
      <StatCard
        icon="equalizer"
        iconClassName="bg-secondary-container/80 text-on-secondary-fixed-variant"
        label="Thống kê nội dung"
        value={
          <span className="text-label-md font-bold text-primary-container">
            {summary.totalQuestions}{" "}
            <span className="font-normal text-on-surface-variant/70">câu</span>
            {" · "}
            {summary.avgDuration}{" "}
            <span className="font-normal text-on-surface-variant/70">phút TB</span>
          </span>
        }
      />
    </div>
  );
}

function StatCard({
  icon,
  iconClassName,
  label,
  value,
  onClick,
  selected = false,
}: {
  icon: string;
  iconClassName: string;
  label: string;
  value: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  const className = `flex w-full items-center gap-4 rounded-lg border p-6 text-left shadow-sm transition ${
    selected
      ? "border-primary/40 bg-primary-fixed/20 ring-2 ring-primary/20"
      : "border-outline-variant/20 bg-white hover:border-outline-variant/40"
  }`;

  const content = (
    <>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <MaterialIcon>{icon}</MaterialIcon>
      </div>
      <div className="min-w-0">
        <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="mt-1 text-[24px] font-bold text-primary-container">{value}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className={className} onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
