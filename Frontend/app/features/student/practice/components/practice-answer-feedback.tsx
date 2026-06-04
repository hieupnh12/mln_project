import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type PracticeAnswerFeedbackProps = {
  autoAdvance: boolean;
  autoAdvanceSeconds: number;
  explanation: string;
  onContinue: () => void;
};

export function PracticeAnswerFeedback({
  autoAdvance,
  autoAdvanceSeconds,
  explanation,
  onContinue,
}: PracticeAnswerFeedbackProps) {
  const hasExplanation = explanation.trim().length > 0;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-200 rounded-xl border border-outline-variant/25 bg-white p-3 shadow-sm md:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 font-bold text-secondary">
            <MaterialIcon filled className="text-[18px]">
              auto_awesome
            </MaterialIcon>
            <span className="text-label-sm uppercase">
              {hasExplanation ? "Giải thích đáp án đúng" : "Chưa có giải thích"}
            </span>
          </div>
          <p className="max-h-24 overflow-y-auto pr-1 text-body-sm leading-relaxed text-on-surface-variant lg:max-h-20">
            {hasExplanation
              ? explanation
              : "Câu hỏi này chưa có phần giải thích. Bạn có thể tiếp tục luyện câu tiếp theo."}
          </p>
        </div>

        {autoAdvance ? (
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-surface-container-low px-4 py-3 text-label-md font-semibold text-primary">
            <MaterialIcon className="text-[18px]">timer</MaterialIcon>
            Tự chuyển sau {autoAdvanceSeconds} giây
          </p>
        ) : (
          <button
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-md font-bold text-on-primary shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95"
            onClick={onContinue}
            type="button"
          >
            Tiếp theo
            <MaterialIcon>arrow_forward</MaterialIcon>
          </button>
        )}
      </div>
    </section>
  );
}
