import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

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
      <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-sm">
        <header className="border-b border-outline-variant/10 bg-primary px-md py-sm text-on-primary">
          <h4 className="flex items-center gap-2 text-label-md font-semibold">
            <MaterialIcon className="text-secondary-fixed">preview</MaterialIcon>
            Tóm tắt cấu hình
          </h4>
          <p className="mt-0.5 text-label-sm text-on-primary/70">
            Cập nhật realtime khi chỉnh form
          </p>
        </header>

        <div className="grid grid-cols-2 divide-x divide-outline-variant/10 border-b border-outline-variant/10">
          <HighlightStat icon="library_books" label="Nguồn lọc" value={candidateCount} />
          <HighlightStat icon="checklist" label="Đã chọn" value={selectedCount} />
        </div>

        <dl className="space-y-0 px-md py-sm">
          <SummaryRow highlight label="Tên quiz" value={title} />
          <SummaryRow label="Phạm vi" value={scope} />
          <SummaryRow
            label="Thời gian / Điểm đạt"
            value={`${settings.duration} phút · ${settings.passingScore}%`}
          />
          <SummaryRow
            label="Random khi làm bài"
            value={settings.randomQuestions ? "Bật" : "Tắt"}
            valueTone={settings.randomQuestions ? "accent" : "muted"}
          />
          <SummaryRow
            label="Trộn đáp án"
            value={settings.shuffleAnswers ? "Bật" : "Tắt"}
            valueTone={settings.shuffleAnswers ? "accent" : "muted"}
          />
        </dl>

        <div className="border-t border-outline-variant/10 bg-secondary-container/20 px-md py-sm">
          <p className="flex items-start gap-2 text-label-sm text-on-surface-variant">
            <MaterialIcon className="shrink-0 text-[16px] text-secondary">lightbulb</MaterialIcon>
            {candidateCount === 0
              ? "Không có câu trong phạm vi. Đổi môn/chương hoặc thêm câu ở Ngân hàng câu hỏi."
              : selectedCount === 0
                ? `Có ${candidateCount} câu khả dụng. Sang tab Câu hỏi để chọn hoặc random ${settings.randomCount} câu.`
                : `Đã chọn ${selectedCount}/${candidateCount} câu trong phạm vi.`}
          </p>
        </div>
      </div>
    </aside>
  );
}

function HighlightStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="px-md py-sm text-center">
      <MaterialIcon className="mx-auto text-[18px] text-secondary">{icon}</MaterialIcon>
      <p className="mt-0.5 text-headline-md font-semibold text-primary">{value}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
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
      className={`flex items-start justify-between gap-sm border-b border-outline-variant/8 py-2 last:border-0 ${
        highlight ? "rounded-md bg-surface-container-low/60 px-2 -mx-2" : ""
      }`}
    >
      <dt className="text-label-sm text-on-surface-variant">{label}</dt>
      <dd className={`max-w-[58%] text-right text-label-md ${valueClass}`}>{value}</dd>
    </div>
  );
}
