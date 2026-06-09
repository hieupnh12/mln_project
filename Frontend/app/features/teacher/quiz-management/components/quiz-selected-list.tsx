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
    <aside className="flex max-h-[min(65vh,520px)] min-h-[320px] flex-col overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm xl:h-full">
      <header className="shrink-0 border-b border-outline-variant/10 bg-surface-container-lowest px-gutter py-4">
        <div className="flex items-center justify-between gap-sm">
          <div>
            <h4 className="text-label-md font-semibold text-primary-container">Đã chọn</h4>
            <p className="text-label-sm text-on-surface-variant">{questions.length} câu trong quiz</p>
          </div>
          {questions.length > 0 ? (
            <button
              className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-label-sm font-medium text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
              onClick={onClearAll}
              type="button"
            >
              Xóa tất cả
            </button>
          ) : null}
        </div>
        {questions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(difficultyBreakdown).map(([level, count]) => (
              <span
                className="rounded-full bg-secondary-container px-2.5 py-0.5 text-label-sm font-medium text-primary"
                key={level}
              >
                {level}: {count}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-gutter">
        {questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-low px-4 py-8 text-center text-label-md text-on-surface-variant">
            Chưa có câu hỏi. Duyệt ngân hàng bên trái hoặc dùng Random.
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div
                className="flex items-start gap-2 rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-3"
                key={question.id}
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <ReorderButton
                    ariaLabel="Lên"
                    disabled={index === 0}
                    icon="arrow_upward"
                    onClick={() => onMove(index, index - 1)}
                  />
                  <ReorderButton
                    ariaLabel="Xuống"
                    disabled={index === questions.length - 1}
                    icon="arrow_downward"
                    onClick={() => onMove(index, index + 1)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-label-sm text-on-surface-variant">
                    #{index + 1} · {question.id}
                  </p>
                  <p className="truncate text-label-md font-medium text-on-surface">{question.title}</p>
                </div>
                <button
                  aria-label={`Bỏ ${question.id}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-error-container/30 hover:text-error"
                  onClick={() => onRemove(question.id)}
                  type="button"
                >
                  <MaterialIcon className="text-[18px]">close</MaterialIcon>
                </button>
              </div>
            ))}
          </div>
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
      className="flex h-6 w-6 items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className="text-[16px]">{icon}</MaterialIcon>
    </button>
  );
}
