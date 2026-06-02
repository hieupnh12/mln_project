import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem } from "../../question-library/types/question-library.types";

type QuizSelectedListProps = {
  onClearAll: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
};

export function QuizSelectedList({
  onClearAll,
  onMove,
  onRemove,
  questions,
}: QuizSelectedListProps) {
  const difficultyBreakdown = questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="flex min-h-[420px] flex-col rounded-xl border border-outline-variant/20 bg-primary-container text-white shadow-[0_8px_24px_rgba(35,39,51,0.1)]">
      <header className="border-b border-white/10 px-md py-sm">
        <div className="flex items-start justify-between gap-sm">
          <div>
            <h4 className="text-headline-md font-semibold">Câu đã chọn</h4>
            <p className="text-label-md text-secondary-container">
              {questions.length} câu · kéo thứ tự bằng nút lên/xuống
            </p>
          </div>
          {questions.length > 0 ? (
            <button
              className="rounded-lg border border-white/20 px-2 py-1 text-label-sm font-medium text-secondary-container transition hover:bg-white/10"
              onClick={onClearAll}
              type="button"
            >
              Xóa hết
            </button>
          ) : null}
        </div>
        {questions.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(difficultyBreakdown).map(([level, count]) => (
              <span
                className="rounded-full bg-white/10 px-2 py-0.5 text-label-sm text-secondary-container"
                key={level}
              >
                {level}: {count}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 space-y-sm overflow-y-auto p-sm">
        {questions.length === 0 ? (
          <p className="rounded-lg bg-white/10 p-md text-body-md text-secondary-container">
            Chưa chọn câu hỏi. Dùng panel bên trái để thêm hoặc random.
          </p>
        ) : (
          questions.map((question, index) => (
            <div
              className="flex items-start gap-1 rounded-lg bg-white/10 p-sm"
              key={question.id}
            >
              <div className="flex shrink-0 flex-col gap-0.5">
                <ReorderButton
                  ariaLabel="Di chuyển lên"
                  disabled={index === 0}
                  icon="arrow_upward"
                  onClick={() => onMove(index, index - 1)}
                />
                <ReorderButton
                  ariaLabel="Di chuyển xuống"
                  disabled={index === questions.length - 1}
                  icon="arrow_downward"
                  onClick={() => onMove(index, index + 1)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-label-sm text-secondary-container">
                  #{index + 1} · {question.id}
                </p>
                <p className="truncate font-semibold">{question.title}</p>
                <p className="line-clamp-1 text-label-md text-secondary-container">
                  {question.difficulty} · {question.type}
                </p>
              </div>
              <button
                aria-label={`Bỏ câu ${question.id}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-secondary-container transition hover:bg-white/10"
                onClick={() => onRemove(question.id)}
                type="button"
              >
                <MaterialIcon>close</MaterialIcon>
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function ReorderButton({
  ariaLabel,
  disabled,
  icon,
  onClick,
}: {
  ariaLabel: string;
  disabled: boolean;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-6 w-6 items-center justify-center rounded text-secondary-container transition hover:bg-white/10 disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className="text-[16px]">{icon}</MaterialIcon>
    </button>
  );
}
