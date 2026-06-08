import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatCloseDeadline, formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizSettingsSummaryProps = {
  candidateCount: number;
  selectedCount: number;
  settings: QuizSettings;
};

export function QuizSettingsSummary({
  candidateCount,
  selectedCount,
  settings,
}: QuizSettingsSummaryProps) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);
  const title = settings.title.trim() || "—";

  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <div className="overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest px-gutter py-4">
          <h4 className="flex items-center gap-2 text-label-md font-semibold text-primary-container">
            <MaterialIcon className="text-[18px] text-secondary">preview</MaterialIcon>
            Tóm tắt
          </h4>
          <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-label-sm font-medium text-primary">
            {selectedCount}/{candidateCount}
          </span>
        </header>

        <dl className="space-y-0 px-gutter py-3">
          <SummaryRow highlight label="Tên" value={title} />
          <SummaryRow label="Phạm vi" value={scope} />
          <SummaryRow
            label="TG / Điểm"
            value={`${settings.duration}′ · ${settings.passingScore}%`}
          />
          <SummaryRow
            label="Đóng lúc"
            value={formatCloseDeadline(settings.availableUntil) || "Không giới hạn"}
            valueTone={settings.availableUntil ? "accent" : "muted"}
          />
          <SummaryRow
            label="Random"
            value={settings.randomQuestions ? "Bật" : "Tắt"}
            valueTone={settings.randomQuestions ? "accent" : "muted"}
          />
          <SummaryRow
            label="Trộn ĐA"
            value={settings.shuffleAnswers ? "Bật" : "Tắt"}
            valueTone={settings.shuffleAnswers ? "accent" : "muted"}
          />
        </dl>

        {candidateCount === 0 || selectedCount === 0 ? (
          <p className="border-t border-outline-variant/10 bg-surface-container-low px-gutter py-3 text-label-sm text-on-surface-variant">
            {candidateCount === 0
              ? "Không có câu — đổi phạm vi."
              : `Có ${candidateCount} câu — sang tab Câu hỏi.`}
          </p>
        ) : null}
      </div>
    </aside>
  );
}

function SummaryRow({
  highlight = false,
  label,
  value,
  valueTone = "default",
}: {
  highlight?: boolean;
  label: string;
  value: string;
  valueTone?: "accent" | "default" | "muted";
}) {
  const valueClass =
    valueTone === "accent"
      ? "text-secondary font-semibold"
      : valueTone === "muted"
        ? "text-on-surface-variant"
        : "text-primary font-medium";

  return (
    <div
      className={`flex items-start justify-between gap-sm border-b border-outline-variant/8 py-1.5 last:border-0 ${
        highlight ? "rounded-md bg-surface-container-low/60 px-1.5 -mx-1.5" : ""
      }`}
    >
      <dt className="text-label-sm text-on-surface-variant">{label}</dt>
      <dd className={`max-w-[58%] text-right text-label-sm ${valueClass}`}>{value}</dd>
    </div>
  );
}
