import type { PracticeAnswerState } from "../types/practice.types";
import type { PracticeOptionVisualState } from "../types/practice.types";
import { PracticeOptionButton } from "./practice-option-button";

type PracticeOptionsListProps = {
  options: string[];
  correctOptionIndex: number;
  answerState: PracticeAnswerState;
  selectedOptionIndex: number | null;
  onSelect: (index: number) => void;
};

function resolveVisualState(
  index: number,
  answerState: PracticeAnswerState,
  selectedOptionIndex: number | null,
  correctOptionIndex: number,
): PracticeOptionVisualState {
  if (answerState === "idle") {
    return "default";
  }

  if (index === correctOptionIndex) {
    return "correct";
  }

  if (selectedOptionIndex === index && index !== correctOptionIndex) {
    return "incorrect";
  }

  return "disabled";
}

export function PracticeOptionsList({
  options,
  correctOptionIndex,
  answerState,
  selectedOptionIndex,
  onSelect,
}: PracticeOptionsListProps) {
  return (
    <section className="flex flex-col gap-3">
      {options.map((text, index) => (
        <PracticeOptionButton
          index={index}
          key={`${index}-${text.slice(0, 12)}`}
          onSelect={onSelect}
          text={text}
          visualState={resolveVisualState(
            index,
            answerState,
            selectedOptionIndex,
            correctOptionIndex,
          )}
        />
      ))}
    </section>
  );
}
