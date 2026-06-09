import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";

type ExamQuestionNavActionsProps = {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function ExamQuestionNavActions({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: ExamQuestionNavActionsProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-outline-variant pt-5">
      <button
        className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-outline px-3 py-2.5 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasPrevious}
        onClick={onPrevious}
        type="button"
      >
        <MaterialIcon className="shrink-0">arrow_back</MaterialIcon>
        <span className="truncate">Câu trước</span>
      </button>
      <button
        className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-surface-container-highest px-3 py-2.5 text-label-sm text-primary transition-colors hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasNext}
        onClick={onNext}
        type="button"
      >
        <span className="truncate">Câu tiếp theo</span>
        <MaterialIcon className="shrink-0">arrow_forward</MaterialIcon>
      </button>
    </div>
  );
}
