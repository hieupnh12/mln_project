import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizPreviewProps = {
  isPublished?: boolean;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
  settings: QuizSettings;
};

export function QuizPreview({
  isPublished = false,
  onRemove,
  questions,
  settings,
}: QuizPreviewProps) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/20 bg-primary-container text-white shadow-[0_12px_32px_rgba(35,39,51,0.12)]">
      <header className="border-b border-white/10 p-sm">
        <h4 className="truncate text-label-md font-semibold">{settings.title}</h4>
        <p className="truncate text-label-sm text-secondary-container">
          {scope} · {questions.length}c · {settings.duration}′ · ≥{settings.passingScore}%
        </p>
      </header>

      <div className="max-h-[min(50vh,420px)] space-y-1.5 overflow-y-auto p-sm">
        {questions.length === 0 ? (
          <p className="rounded-lg bg-white/10 p-sm text-label-sm text-secondary-container">
            Chưa có câu
          </p>
        ) : (
          questions.map((question, index) => (
            <article className="rounded-lg border border-white/10 bg-white/5 p-2" key={question.id}>
              <div className="mb-1.5 flex items-start justify-between gap-sm">
                <div className="min-w-0">
                  <p className="font-mono text-label-sm text-secondary-container">
                    {index + 1}. {question.id}
                  </p>
                  <p className="truncate text-label-md font-semibold">{question.title}</p>
                </div>
                {!isPublished ? (
                  <button
                    aria-label="Bỏ câu"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary-container hover:bg-white/10"
                    onClick={() => onRemove(question.id)}
                    type="button"
                  >
                    <MaterialIcon className="text-[16px]">close</MaterialIcon>
                  </button>
                ) : null}
              </div>
              <p className="mb-2 line-clamp-2 text-label-sm text-secondary-container">
                {question.question}
              </p>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {question.options.slice(0, 4).map((option, optionIndex) => (
                  <li
                    className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-label-sm"
                    key={`${question.id}-${optionIndex}`}
                  >
                    <span className="mr-1 font-semibold">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    {option.length > 48 ? `${option.slice(0, 48)}…` : option}
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
