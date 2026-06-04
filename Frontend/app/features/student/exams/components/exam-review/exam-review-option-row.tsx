import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import type { ExamReviewOption } from "../../types/exam-review.types";

type ExamReviewOptionRowProps = {
  option: ExamReviewOption;
};

export function ExamReviewOptionRow({ option }: ExamReviewOptionRowProps) {
  const { state } = option;

  if (state === "correct") {
    return (
      <div className="flex cursor-default items-center gap-4 rounded-lg border-2 border-secondary bg-secondary-container/30 p-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-label-sm font-semibold text-on-secondary">
          {option.label}
        </div>
        <span className="flex-1 text-body-md font-semibold text-primary">{option.content}</span>
        <MaterialIcon className="text-secondary" filled>
          check_circle
        </MaterialIcon>
      </div>
    );
  }

  if (state === "selected_wrong") {
    return (
      <div className="flex cursor-default items-center gap-4 rounded-lg border-2 border-error bg-error-container/20 p-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error text-label-sm font-semibold text-on-error">
          {option.label}
        </div>
        <span className="flex-1 text-body-md text-primary">{option.content}</span>
        <MaterialIcon className="text-error">close</MaterialIcon>
      </div>
    );
  }

  return (
    <div className="flex cursor-default items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-outline text-label-sm font-semibold">
        {option.label}
      </div>
      <span className="text-body-md text-on-surface">{option.content}</span>
    </div>
  );
}
