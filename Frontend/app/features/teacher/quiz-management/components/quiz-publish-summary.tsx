import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizPublishSummaryProps = {
  questionCount: number;
  settings: QuizSettings;
};

export function QuizPublishSummary({ questionCount, settings }: QuizPublishSummaryProps) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);
  const perQuestionMinutes =
    questionCount > 0 ? (settings.duration / questionCount).toFixed(1) : "—";

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-md">
      <h4 className="mb-md flex items-center gap-2 text-headline-md font-semibold text-primary">
        <MaterialIcon>summarize</MaterialIcon>
        Thông số xuất bản
      </h4>

      <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
        <StatBlock icon="quiz" label="Câu hỏi" value={String(questionCount)} />
        <StatBlock icon="timer" label="Thời gian" value={`${settings.duration}′`} />
        <StatBlock icon="grade" label="Điểm đạt" value={`${settings.passingScore}%`} />
        <StatBlock icon="speed" label="Phút/câu" value={String(perQuestionMinutes)} />
      </div>

      <dl className="mt-md space-y-2 border-t border-outline-variant/15 pt-md text-body-md">
        <Row label="Phạm vi" value={scope} />
        <Row
          label="Random câu khi làm bài"
          value={settings.randomQuestions ? "Có — mỗi SV có thể khác nhau" : "Không — cố định thứ tự đã chọn"}
        />
        <Row
          label="Trộn đáp án"
          value={settings.shuffleAnswers ? "Có — đáp án xáo trộn" : "Không — giữ nguyên thứ tự đáp án"}
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
    <div className="rounded-lg bg-white p-sm text-center shadow-sm">
      <MaterialIcon className="mx-auto text-secondary">{icon}</MaterialIcon>
      <p className="mt-1 text-headline-md font-semibold text-primary">{value}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-medium text-primary sm:max-w-[55%] sm:text-right">{value}</dd>
    </div>
  );
}
