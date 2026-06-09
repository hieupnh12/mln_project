import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import type { ExamQuestion } from "../../types/exam-session.types";

type ExamQuestionPanelProps = {
  question: ExamQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswerId?: number;
  isFlagged: boolean;
  onSelectAnswer: (answerId: number) => void;
  onToggleFlag: () => void;
};

export function ExamQuestionPanel({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswerId,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
}: ExamQuestionPanelProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-secondary-container px-3 py-1 text-label-md text-on-secondary-container">
            Câu hỏi {questionIndex + 1} / {totalQuestions}
          </span>
          <button
            className={`flex items-center gap-1 transition-colors ${isFlagged ? "text-error" : "text-on-surface-variant hover:text-primary"}`}
            onClick={onToggleFlag}
            type="button"
          >
            <MaterialIcon className="text-[20px]">flag</MaterialIcon>
            <span className="text-label-md">Đánh dấu xem lại</span>
          </button>
        </div>

        <h2 className="mb-8 text-headline-md leading-relaxed text-on-surface">{question.question}</h2>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswerId === option.answerId;
            return (
              <label
                className={
                  isSelected
                    ? "group relative flex cursor-pointer items-center rounded-lg border-2 border-secondary bg-secondary-container/20 p-5 transition-all active:scale-[0.99]"
                    : "group relative flex cursor-pointer items-center rounded-lg border border-outline-variant p-5 transition-all hover:border-secondary hover:bg-surface-container-low active:scale-[0.99]"
                }
                key={option.answerId}
              >
                <input
                  checked={isSelected}
                  className="mr-4 h-5 w-5 border-outline-variant text-primary focus:ring-primary"
                  name={question.id}
                  onChange={() => onSelectAnswer(option.answerId)}
                  type="radio"
                />
                <span
                  className={
                    isSelected
                      ? "text-body-md font-semibold text-on-surface"
                      : "text-body-md text-on-surface"
                  }
                >
                  {option.label}. {option.content}
                </span>
              </label>
            );
          })}
        </div>
      </section>

    </div>
  );
}
