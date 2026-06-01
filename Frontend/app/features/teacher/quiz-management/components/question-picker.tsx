import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../../question-library/types/question-library.types";

type QuestionPickerProps = {
  onAdd: (id: string) => void;
  questions: QuestionItem[];
  selectedIds: string[];
};

export function QuestionPicker({
  onAdd,
  questions,
  selectedIds,
}: QuestionPickerProps) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="mb-sm text-headline-md font-semibold text-primary">
        Câu hỏi phù hợp
      </h4>
      <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
        {questions.map((question) => {
          const selected = selectedIds.includes(question.id);

          return (
            <article
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm"
              key={question.id}
            >
              <div className="mb-3 flex items-start justify-between gap-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-primary">{question.title}</p>
                  <p className="line-clamp-2 text-body-md text-on-surface-variant">
                    {question.question}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-secondary">
                  {question.id}
                </span>
              </div>
              <button
                className="flex w-full items-center justify-center gap-sm rounded-lg bg-white px-sm py-2 text-label-md font-semibold text-primary transition hover:bg-secondary-container disabled:opacity-70"
                disabled={selected}
                onClick={() => onAdd(question.id)}
                type="button"
              >
                <MaterialIcon>{selected ? "check" : "add"}</MaterialIcon>
                {selected ? "Đã thêm" : "Thêm vào quiz"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
