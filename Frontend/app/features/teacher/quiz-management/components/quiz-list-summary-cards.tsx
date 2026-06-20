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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon="quiz"
        iconClassName="bg-catalog-cyan/12 text-catalog-cobalt"
        label="Tổng số quiz"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={
          <>
            {summary.total.toLocaleString("vi-VN")}{" "}
            <span className="text-label-md font-normal text-landing-text-soft">quiz</span>
          </>
        }
      />
      <StatCard
        icon="edit_note"
        iconClassName="bg-landing-gray text-landing-text-soft"
        label="Bản nháp"
        onClick={() => onStatusFilter("Bản nháp")}
        selected={activeStatus === "Bản nháp"}
        value={
          <>
            {summary.draftCount}{" "}
            <span className="text-label-md font-normal text-landing-text-soft">nháp</span>
          </>
        }
      />
      <StatCard
        icon="published_with_changes"
        iconClassName="bg-catalog-indigo/10 text-catalog-indigo"
        label="Đang mở"
        onClick={() => onStatusFilter("Đã xuất bản")}
        selected={activeStatus === "Đã xuất bản"}
        value={
          <>
            {summary.publishedCount}{" "}
            <span className="text-label-md font-normal text-landing-text-soft">live</span>
          </>
        }
      />
      <StatCard
        icon="equalizer"
        iconClassName="bg-landing-gold/15 text-landing-text-muted"
        label="Thống kê nội dung"
        value={
          <span className="text-label-md font-bold text-landing-text">
            {summary.totalQuestions}{" "}
            <span className="font-normal text-landing-text-soft">câu</span>
            {" · "}
            {summary.avgDuration}{" "}
            <span className="font-normal text-landing-text-soft">phút TB</span>
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
  const className = `flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
    selected
      ? "border-primary/25 bg-landing-gray/50 ring-1 ring-primary/15"
      : "border-outline-variant/25 bg-landing-gray/30 hover:border-outline-variant/45 hover:bg-landing-gray/45"
  }`;

  const content = (
    <>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <MaterialIcon>{icon}</MaterialIcon>
      </div>
      <div className="min-w-0">
        <p className="text-label-sm font-medium text-landing-text-soft">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-landing-text">{value}</p>
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
