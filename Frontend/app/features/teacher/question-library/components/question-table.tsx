import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../types/question-library.types";

export function QuestionTable({ questions }: { questions: QuestionItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="hidden grid-cols-[90px_minmax(0,1fr)_150px_120px_120px] gap-4 border-b border-outline-variant/20 bg-surface-container-low px-md py-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant md:grid">
        <span>Mã</span>
        <span>Câu hỏi</span>
        <span>Vị trí</span>
        <span>Độ khó</span>
        <span>Thao tác</span>
      </div>
      <div className="divide-y divide-outline-variant/20">
        {questions.map((question) => (
          <article
            className="grid gap-3 px-md py-md md:grid-cols-[90px_minmax(0,1fr)_150px_120px_120px] md:items-center"
            key={question.id}
          >
            <span className="text-label-md font-semibold text-secondary">
              {question.id}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-primary">{question.title}</p>
              <p className="line-clamp-2 text-body-md text-on-surface-variant">
                {question.question}
              </p>
            </div>
            <span className="text-label-sm font-semibold text-on-surface-variant">
              {question.chapter} / {question.lesson}
            </span>
            <span className="w-fit rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
              {question.difficulty}
            </span>
            <div className="flex gap-2">
              <IconButton icon="visibility" label="Xem" />
              <IconButton icon="edit" label="Sửa" />
              <IconButton icon="content_copy" label="Nhân bản" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
      title={label}
      type="button"
    >
      <MaterialIcon className="text-[20px]">{icon}</MaterialIcon>
    </button>
  );
}
