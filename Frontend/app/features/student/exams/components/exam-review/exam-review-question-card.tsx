import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import type { ExamReviewQuestion } from "../../types/exam-review.types";
import { ExamReviewOptionRow } from "./exam-review-option-row";

type ExamReviewQuestionCardProps = {
  item: ExamReviewQuestion;
};

export function ExamReviewQuestionCard({ item }: ExamReviewQuestionCardProps) {
  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-full bg-surface-container px-3 py-1 text-label-md text-on-surface-variant">
          Câu hỏi {item.index}
        </span>
        {item.correct ? (
          <span className="flex items-center gap-1 text-label-md text-secondary">
            <MaterialIcon className="text-[16px]" filled>
              check_circle
            </MaterialIcon>
            Đúng
          </span>
        ) : (
          <span className="flex items-center gap-1 text-label-md text-error">
            <MaterialIcon className="text-[16px]">cancel</MaterialIcon>
            Sai
          </span>
        )}
      </div>

      <h3 className="mb-6 text-body-lg text-primary">{item.question}</h3>

      <div className="mb-8 space-y-3">
        {item.options.map((option) => (
          <ExamReviewOptionRow key={option.answerId} option={option} />
        ))}
      </div>

      <div className="rounded-lg border-l-4 border-secondary-container bg-primary-container p-6">
        <div className="mb-3 flex items-center gap-2 text-secondary-container">
          <MaterialIcon>auto_awesome</MaterialIcon>
          <span className="text-label-md uppercase tracking-wider">Giải thích đáp án đúng</span>
        </div>
        <p className="text-body-md text-inverse-on-surface/90">{item.explanation}</p>
      </div>
    </article>
  );
}
