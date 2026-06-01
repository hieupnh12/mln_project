import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizPreviewProps = {
  canPublish?: boolean;
  isPublished?: boolean;
  onPublish: () => void;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
  settings: QuizSettings;
};

export function QuizPreview({
  canPublish = true,
  isPublished = false,
  onPublish,
  onRemove,
  questions,
  settings,
}: QuizPreviewProps) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-primary-container text-white shadow-[0_12px_32px_rgba(35,39,51,0.12)]">
      <header className="border-b border-white/10 p-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label-sm uppercase tracking-wide text-secondary-container">
              Xem trước giao diện sinh viên
            </p>
            <h4 className="mt-1 text-headline-md font-semibold">{settings.title}</h4>
            <p className="mt-1 text-body-md text-secondary-container">{scope}</p>
            <p className="mt-2 text-label-md text-secondary-container">
              {questions.length} câu · {settings.duration} phút · đạt {settings.passingScore}%
              {settings.shuffleAnswers ? " · trộn đáp án" : ""}
            </p>
          </div>
          <button
            className="rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container disabled:opacity-60"
            disabled={questions.length === 0 || isPublished || !canPublish}
            onClick={onPublish}
            type="button"
          >
            {isPublished ? "Đã xuất bản" : "Publish quiz"}
          </button>
        </div>
      </header>

      <div className="space-y-sm p-md">
        {questions.length === 0 ? (
          <p className="rounded-xl bg-white/10 p-md text-secondary-container">
            Chưa có câu hỏi nào trong quiz. Quay lại tab Câu hỏi để thêm.
          </p>
        ) : (
          questions.map((question, index) => (
            <article
              className="rounded-xl border border-white/10 bg-white/5 p-sm"
              key={question.id}
            >
              <div className="mb-2 flex items-start justify-between gap-sm">
                <div className="min-w-0">
                  <p className="font-mono text-label-sm text-secondary-container">
                    Câu {index + 1} · {question.id}
                  </p>
                  <p className="font-semibold">{question.title}</p>
                </div>
                {!isPublished ? (
                  <button
                    aria-label="Bỏ câu hỏi"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-secondary-container hover:bg-white/10"
                    onClick={() => onRemove(question.id)}
                    type="button"
                  >
                    <MaterialIcon>close</MaterialIcon>
                  </button>
                ) : null}
              </div>
              <p className="mb-3 text-body-md text-secondary-container">{question.question}</p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.options.slice(0, 4).map((option, optionIndex) => (
                  <li
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-label-md"
                    key={`${question.id}-${optionIndex}`}
                  >
                    <span className="mr-2 font-semibold">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    {option.length > 60 ? `${option.slice(0, 60)}…` : option}
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
