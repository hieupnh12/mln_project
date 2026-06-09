import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatCloseDeadline, formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizPublishSummaryProps = {
  questionCount: number;
  settings: QuizSettings;
};

export function QuizPublishSummary({ questionCount, settings }: QuizPublishSummaryProps) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);
  const perQuestionMinutes =
    questionCount > 0 ? (settings.duration / questionCount).toFixed(1) : "—";

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm">
      <h4 className="mb-sm flex items-center gap-1.5 text-label-md font-semibold text-primary">
        <MaterialIcon className="text-[16px]">summarize</MaterialIcon>
        Thông số
      </h4>

      <div className="grid grid-cols-4 gap-1.5">
        <StatBlock icon="quiz" label="Câu" value={String(questionCount)} />
        <StatBlock icon="timer" label="Phút" value={`${settings.duration}′`} />
        <StatBlock icon="grade" label="Điểm" value={`${settings.passingScore}%`} />
        <StatBlock icon="speed" label="P/câu" value={String(perQuestionMinutes)} />
      </div>

      <dl className="mt-sm space-y-1 border-t border-outline-variant/15 pt-sm text-label-sm">
        <Row label="Phạm vi" value={scope} />
        <Row label="Random" value={settings.randomQuestions ? "Bật" : "Tắt"} />
        <Row label="Trộn ĐA" value={settings.shuffleAnswers ? "Bật" : "Tắt"} />
        <Row
          label="Đóng lúc"
          value={formatCloseDeadline(settings.availableUntil) || "Không giới hạn"}
        />
      </dl>
    </section>
  );
}

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-white p-1.5 text-center shadow-sm">
      <MaterialIcon className="mx-auto text-[16px] text-secondary">{icon}</MaterialIcon>
      <p className="text-label-md font-semibold text-primary">{value}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="max-w-[55%] text-right font-medium text-primary">{value}</dd>
    </div>
  );
}
