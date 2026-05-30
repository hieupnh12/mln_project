import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionLibraryStats } from "../utils/question-library-stats";

type QuestionStatsCardsProps = {
  stats: QuestionLibraryStats;
};

export function QuestionStatsCards({ stats }: QuestionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="library_books"
        iconClassName="bg-primary-fixed text-primary"
        label="Tổng số câu hỏi"
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
          <span className="text-label-md font-bold text-primary-container">
            {stats.byStatus["Đã xuất bản"]}{" "}
            <span className="font-normal text-on-surface-variant/70">Đã duyệt</span>
            {" / "}
            {stats.byStatus["Bản nháp"]}{" "}
            <span className="font-normal text-on-surface-variant/70">Nháp</span>
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
}: {
  icon: string;
  iconClassName: string;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-outline-variant/20 bg-white p-6 shadow-sm">
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
    </div>
  );
}
