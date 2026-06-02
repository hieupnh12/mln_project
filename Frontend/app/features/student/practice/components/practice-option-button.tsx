import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { getOptionLabel } from "../utils/option-labels";
import type { PracticeOptionVisualState } from "../types/practice.types";

type PracticeOptionButtonProps = {
  index: number;
  text: string;
  visualState: PracticeOptionVisualState;
  onSelect: (index: number) => void;
};

function optionClassName(state: PracticeOptionVisualState): string {
  const base =
    "group flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all duration-250";

  switch (state) {
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
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-label-md font-bold transition-colors";

  switch (state) {
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
  onSelect,
}: PracticeOptionButtonProps) {
  const label = getOptionLabel(index);
  const isCorrect = visualState === "correct";

  return (
    <button
      className={optionClassName(visualState)}
      disabled={visualState !== "default"}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className={badgeClassName(visualState)}>
        {isCorrect ? (
          <MaterialIcon className="text-[20px] font-bold">check</MaterialIcon>
        ) : (
          label
        )}
      </span>
      <span className="pt-0.5 text-body-md">{text}</span>
    </button>
  );
}
