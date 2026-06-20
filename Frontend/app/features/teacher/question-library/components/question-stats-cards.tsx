import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionStatus } from "../types/question-library.types";
import type { QuestionLibraryStats } from "../utils/question-library-stats";

type QuestionStatsCardsProps = {
  activeStatus: QuestionStatus | "all";
  onStatusFilter: (status: QuestionStatus | "all") => void;
  stats: QuestionLibraryStats;
};

export function QuestionStatsCards({
  stats,
  activeStatus,
  onStatusFilter,
}: QuestionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon="library_books"
        iconClassName="bg-catalog-cyan/12 text-catalog-cobalt"
        label="Tổng số câu hỏi"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={
          <>
            {stats.totalQuestions.toLocaleString("vi-VN")}{" "}
            <span className="text-label-md font-normal text-landing-text-soft">câu</span>
          </>
        }
      />
      <StatCard
        icon="auto_stories"
        iconClassName="bg-primary-container/15 text-primary"
        label="Tổng số môn học"
        value={
          <>
            {stats.totalCourses}{" "}
            <span className="text-label-md font-normal text-landing-text-soft">môn</span>
          </>
        }
      />
      <StatCard
        icon="equalizer"
        iconClassName="bg-catalog-indigo/10 text-catalog-indigo"
        label="Phân loại độ khó"
        value={
          <span className="text-label-md font-bold text-landing-text">
            {stats.byDifficulty["Cơ bản"]}{" "}
            <span className="font-normal text-landing-text-soft">Cơ bản</span>
            {" / "}
            {stats.byDifficulty["Nâng cao"]}{" "}
            <span className="font-normal text-landing-text-soft">Nâng cao</span>
          </span>
        }
      />
      <StatCard
        icon="verified"
        iconClassName="bg-landing-gold/15 text-landing-text-muted"
        label="Trạng thái duyệt"
        value={
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <StatusChip
              active={activeStatus === "Đã xuất bản"}
              count={stats.byStatus["Đã xuất bản"]}
              label="Đã duyệt"
              onClick={() => onStatusFilter("Đã xuất bản")}
            />
            <StatusChip
              active={activeStatus === "Cần duyệt"}
              count={stats.byStatus["Cần duyệt"]}
              label="Chờ duyệt"
              onClick={() => onStatusFilter("Cần duyệt")}
            />
            <StatusChip
              active={activeStatus === "Bản nháp"}
              count={stats.byStatus["Bản nháp"]}
              label="Nháp"
              onClick={() => onStatusFilter("Bản nháp")}
            />
          </div>
        }
      />
    </div>
  );
}

function StatusChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "rounded-full bg-primary/10 px-2.5 py-0.5 text-label-sm font-semibold text-primary ring-1 ring-primary/25"
          : "rounded-full px-2.5 py-0.5 text-label-sm font-medium text-landing-text-soft transition hover:bg-landing-gray/70"
      }
      onClick={onClick}
      type="button"
    >
      {count} {label}
    </button>
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
