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

  return (
    <aside className="space-y-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-md">
      <header>
        <h4 className="flex items-center gap-2 text-headline-md font-semibold text-primary">
          <MaterialIcon>preview</MaterialIcon>
          Tóm tắt cấu hình
        </h4>
        <p className="mt-1 text-label-md text-on-surface-variant">
          Cập nhật realtime khi bạn chỉnh form bên trái.
        </p>
      </header>

      <dl className="space-y-sm">
        <SummaryRow label="Tên quiz" value={settings.title.trim() || "—"} />
        <SummaryRow label="Phạm vi" value={scope} />
        <SummaryRow
          label="Thời gian / Điểm đạt"
          value={`${settings.duration} phút · ${settings.passingScore}%`}
        />
        <SummaryRow
          label="Random khi publish"
          value={settings.randomQuestions ? "Bật" : "Tắt"}
        />
        <SummaryRow
          label="Trộn đáp án"
          value={settings.shuffleAnswers ? "Bật" : "Tắt"}
        />
      </dl>

      <div className="grid grid-cols-2 gap-sm">
        <MiniStat icon="library_books" label="Nguồn lọc" value={candidateCount} />
        <MiniStat icon="checklist" label="Đã chọn" value={selectedCount} />
      </div>

      <div className="rounded-lg border border-outline-variant/15 bg-white p-sm">
        <p className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
          Gợi ý
        </p>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {candidateCount === 0
            ? "Không có câu hỏi trong phạm vi này. Đổi môn/chương hoặc thêm câu ở Ngân hàng câu hỏi."
            : selectedCount === 0
              ? `Có ${candidateCount} câu khả dụng. Sang tab Câu hỏi để chọn hoặc random ${settings.randomCount} câu.`
              : `Đã chọn ${selectedCount}/${candidateCount} câu trong phạm vi.`}
        </p>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-sm border-b border-outline-variant/10 pb-sm last:border-0 last:pb-0">
      <dt className="text-label-md text-on-surface-variant">{label}</dt>
      <dd className="max-w-[60%] text-right text-body-md font-medium text-primary">{value}</dd>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-white p-sm text-center">
      <MaterialIcon className="mx-auto text-secondary">{icon}</MaterialIcon>
      <p className="mt-1 text-headline-md font-semibold text-primary">{value}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}
