import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionLibraryStats } from "../utils/question-library-stats";
import type { QuestionStatus } from "../types/question-library.types";

type QuestionStatsCardsProps = {
  stats: QuestionLibraryStats;
  activeStatus: QuestionStatus | "all";
  onStatusFilter: (status: QuestionStatus | "all") => void;
};

export function QuestionStatsCards({
  stats,
  activeStatus,
  onStatusFilter,
}: QuestionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="library_books"
        iconClassName="bg-primary-fixed text-primary"
        label="Tổng số câu hỏi"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={
          <>
            {stats.totalQuestions.toLocaleString("vi-VN")}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">
              câu
            </span>
          </>
        }
      />
      <StatCard
        icon="auto_stories"
        iconClassName="bg-secondary-fixed text-secondary"
        label="Tổng số môn học"
        value={
          <>
            {stats.totalCourses}{" "}
            <span className="text-label-md font-normal text-on-surface-variant">
              môn
            </span>
          </>
        }
      />
      <StatCard
        icon="equalizer"
        iconClassName="bg-secondary-container text-on-secondary-container"
        label="Phân loại độ khó"
        value={
          <span className="text-label-md font-bold text-primary-container">
            {stats.byDifficulty["Cơ bản"]}{" "}
            <span className="font-normal text-on-surface-variant/70">Cơ bản</span>
            {" / "}
            {stats.byDifficulty["Nâng cao"]}{" "}
            <span className="font-normal text-on-surface-variant/70">Nâng cao</span>
          </span>
        }
      />
      <StatCard
        icon="verified"
        iconClassName="bg-secondary-container/80 text-on-secondary-fixed-variant"
        label="Trạng thái duyệt"
        value={
          <div className="flex flex-wrap gap-x-3 gap-y-1">
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
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "rounded-full bg-primary-fixed px-2.5 py-0.5 text-label-sm font-semibold text-primary ring-2 ring-primary/30"
          : "rounded-full px-2.5 py-0.5 text-label-sm font-medium text-on-surface-variant transition hover:bg-surface-container-high"
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
