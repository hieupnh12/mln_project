import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { getOptionLabel } from "../utils/option-labels";
import type { PracticeOptionVisualState } from "../types/practice.types";

type PracticeOptionButtonProps = {
  index: number;
  text: string;
  visualState: PracticeOptionVisualState;
  isMultipleChoice: boolean;
  isSelected: boolean;
  onSelect: (index: number) => void;
};

function optionClassName(state: PracticeOptionVisualState): string {
  const base =
    "group flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-250 md:min-h-[72px]";

  switch (state) {
    case "selected":
      return `${base} border-secondary bg-secondary-container/15 ring-2 ring-secondary/15`;
    case "correct":
      return `${base} border-secondary bg-secondary-container/20 ring-2 ring-secondary/20 pointer-events-none`;
    case "incorrect":
      return `${base} border-error/20 bg-error-container/50 pointer-events-none`;
    case "disabled":
      return `${base} border-outline-variant/20 bg-surface-container-lowest opacity-70 pointer-events-none`;
    default:
      return `${base} border-outline-variant/20 bg-surface-container-lowest hover:border-secondary`;
  }
}

function badgeClassName(state: PracticeOptionVisualState): string {
  const base =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-label-md font-bold transition-colors";

  switch (state) {
    case "selected":
      return `${base} bg-secondary text-on-secondary`;
    case "correct":
      return `${base} bg-secondary-container text-secondary`;
    case "incorrect":
      return `${base} bg-error text-on-error`;
    default:
      return `${base} bg-surface-container-high text-on-surface-variant group-hover:bg-secondary group-hover:text-on-primary`;
  }
}

export function PracticeOptionButton({
  index,
  text,
  visualState,
  isMultipleChoice,
  isSelected,
  onSelect,
}: PracticeOptionButtonProps) {
  const label = getOptionLabel(index);
  const isCorrect = visualState === "correct";
  const isInteractive = visualState === "default" || visualState === "selected";

  return (
    <button
      className={optionClassName(visualState)}
      disabled={!isInteractive}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className={badgeClassName(visualState)}>
        {isCorrect ? (
          <MaterialIcon className="text-[20px] font-bold">check</MaterialIcon>
        ) : isMultipleChoice && isInteractive ? (
          <MaterialIcon className="text-[18px]">
            {isSelected ? "check_box" : "check_box_outline_blank"}
          </MaterialIcon>
        ) : (
          label
        )}
      </span>
      <span className="min-w-0 text-body-sm leading-relaxed md:text-body-md">{text}</span>
    </button>
  );
}
