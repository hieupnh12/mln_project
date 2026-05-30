import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";

type QuizPreviewProps = {
  onPublish: () => void;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
  settings: QuizSettings;
};

export function QuizPreview({
  onPublish,
  onRemove,
  questions,
  settings,
}: QuizPreviewProps) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-primary-container p-md text-white shadow-[0_12px_32px_rgba(35,39,51,0.12)]">
      <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-headline-md font-semibold">{settings.title}</h4>
          <p className="text-body-md text-secondary-container">
            {questions.length} câu - {settings.duration} phút - đạt{" "}
            {settings.passingScore}%
          </p>
        </div>
        <button
          className="rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container disabled:opacity-60"
          disabled={questions.length === 0}
          onClick={onPublish}
          type="button"
        >
          Publish quiz
        </button>
      </div>
      <div className="space-y-sm">
        {questions.map((question, index) => (
          <div
            className="flex items-center justify-between gap-sm rounded-xl bg-white/10 p-sm"
            key={question.id}
          >
            <div className="min-w-0">
              <p className="font-semibold">
                Câu {index + 1}: {question.title}
              </p>
              <p className="line-clamp-1 text-sm text-secondary-container">
                {question.question}
              </p>
            </div>
            <button
              aria-label="Bỏ câu hỏi"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-container hover:bg-white/10"
              onClick={() => onRemove(question.id)}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="rounded-xl bg-white/10 p-md text-secondary-container">
            Chưa có câu hỏi nào trong quiz.
          </p>
        )}
      </div>
    </section>
  );
}
