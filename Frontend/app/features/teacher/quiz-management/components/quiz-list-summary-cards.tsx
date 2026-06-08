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
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <SummaryChip
        icon="quiz"
        label="Tổng"
        onClick={() => onStatusFilter("all")}
        selected={activeStatus === "all"}
        value={`${summary.total} bài`}
      />
      <SummaryChip
        icon="edit_note"
        label="Nháp"
        onClick={() => onStatusFilter("Bản nháp")}
        selected={activeStatus === "Bản nháp"}
        value={`${summary.draftCount}`}
      />
      <SummaryChip
        icon="published_with_changes"
        label="Live"
        onClick={() => onStatusFilter("Đã xuất bản")}
        selected={activeStatus === "Đã xuất bản"}
        value={`${summary.publishedCount}`}
      />
      <SummaryChip
        icon="schedule"
        label="TB thời gian"
        value={`${summary.avgDuration}′ · ${summary.totalQuestions} câu`}
      />
    </div>
  );
}

function SummaryChip({
  icon,
  label,
  onClick,
  selected = false,
  value,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  value: ReactNode;
}) {
  const interactive = Boolean(onClick);

  return (
    <button
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition ${
        selected
          ? "border-secondary bg-secondary-container/40 text-primary"
          : "border-outline-variant/20 bg-white text-on-surface-variant hover:border-outline-variant/40"
      } ${interactive ? "cursor-pointer" : "cursor-default"}`}
      disabled={!interactive}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className={`text-[16px] ${selected ? "text-secondary" : ""}`}>
        {icon}
      </MaterialIcon>
      <span className="text-label-sm font-medium">{label}</span>
      <span className="text-label-md font-semibold text-primary">{value}</span>
    </button>
  );
}

const quickSteps = [
  "Tạo quiz hoặc mở bản nháp",
  "Cài đặt phạm vi, thời gian, điểm",
  "Chọn câu → xuất bản",
] as const;

export function QuizListQuickTips() {
  return (
    <aside className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-outline-variant/15 bg-secondary-container/15 px-sm py-1.5">
      <span className="inline-flex shrink-0 items-center gap-1 text-secondary">
        <MaterialIcon className="text-[16px]">tips_and_updates</MaterialIcon>
        <span className="text-label-sm font-semibold text-primary">Quy trình nhanh</span>
      </span>
      <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-label-sm text-on-surface-variant">
        {quickSteps.map((step, index) => (
          <li className="inline-flex items-center gap-2" key={step}>
            {index > 0 ? (
              <span aria-hidden className="text-outline-variant/60">
                ·
              </span>
            ) : null}
            <span>
              <span className="font-semibold text-primary">{index + 1}.</span> {step}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
