import type { ExamQuestion, QuestionNavState } from "../../types/exam-session.types";
import { getQuestionNavClass } from "../../utils/get-question-nav-class";

type ExamQuestionNavProps = {
  questions: ExamQuestion[];
  currentIndex: number;
  answeredCount: number;
  flaggedIndices: Set<number>;
  isAnswered: (index: number) => boolean;
  onSelect: (index: number) => void;
};

function resolveNavState(
  index: number,
  currentIndex: number,
  flagged: boolean,
  answered: boolean,
): QuestionNavState {
  if (index === currentIndex) {
    return "current";
  }
  if (flagged) {
    return "flagged";
  }
  if (answered) {
    return "answered";
  }
  return "unanswered";
}

export function ExamQuestionNav({
  questions,
  currentIndex,
  answeredCount,
  flaggedIndices,
  isAnswered,
  onSelect,
}: ExamQuestionNavProps) {
  return (
    <aside className="flex w-full flex-col gap-6 md:w-80">
      <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
            Danh sách câu hỏi
          </h3>
          <span className="text-label-sm text-on-surface-variant">
            {answeredCount}/{questions.length}
          </span>
        </div>

        <div className="custom-scrollbar grid max-h-[400px] grid-cols-5 gap-2 overflow-y-auto pr-2">
          {questions.map((question, index) => {
            const answered = isAnswered(index);
            const flagged = flaggedIndices.has(index);
            const state = resolveNavState(index, currentIndex, flagged, answered);

            return (
              <button
                className={getQuestionNavClass(state)}
                key={question.id}
                onClick={() => onSelect(index)}
                type="button"
              >
                {index + 1}
                {flagged ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-error" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-3 border-t border-outline-variant pt-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded bg-secondary" />
            <span className="text-label-sm text-on-surface-variant">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-2 border-secondary bg-secondary-container/40" />
            <span className="text-label-sm text-on-surface-variant">Đang làm</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border border-secondary/30 bg-surface-container-lowest" />
            <span className="text-label-sm text-on-surface-variant">Chưa trả lời</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-4 w-4 rounded bg-secondary">
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full border border-white bg-error" />
            </div>
            <span className="text-label-sm text-on-surface-variant">Đánh dấu xem lại</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-secondary-container/30 bg-secondary-container/20 p-6">
        <div className="mb-2 flex items-center gap-2 text-on-secondary-container">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          <span className="text-label-md font-bold">Lưu ý</span>
        </div>
        <p className="text-label-sm leading-relaxed text-on-secondary-container/90">
          Hệ thống tự động lưu bài làm mỗi 30 giây. Nhấn &quot;Nộp bài&quot; trước khi hết giờ — khi
          hết thời gian, hộp thoại nộp bài sẽ hiện ra.
        </p>
      </div>
    </aside>
  );
}
