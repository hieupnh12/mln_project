import type { PracticeAnswerState } from "../types/practice.types";
import type { PracticeOptionVisualState } from "../types/practice.types";
import { PracticeOptionButton } from "./practice-option-button";

type PracticeOptionsListProps = {
  options: string[];
  isMultipleChoice: boolean;
  correctOptionIndices: number[];
  answerState: PracticeAnswerState;
  selectedOptionIndices: number[];
  onSelect: (index: number) => void;
};

function resolveVisualState(
  index: number,
  answerState: PracticeAnswerState,
  selectedOptionIndices: number[],
  correctOptionIndices: number[],
): PracticeOptionVisualState {
  if (answerState === "idle") {
    return selectedOptionIndices.includes(index) ? "selected" : "default";
  }

  const isCorrectOption = correctOptionIndices.includes(index);
  const isSelected = selectedOptionIndices.includes(index);

  if (isCorrectOption) {
    return "correct";
  }

  if (isSelected) {
    return "incorrect";
  }

  return "disabled";
}

export function PracticeOptionsList({
  options,
  isMultipleChoice,
  correctOptionIndices,
  answerState,
  selectedOptionIndices,
  onSelect,
}: PracticeOptionsListProps) {
  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {options.map((text, index) => (
        <PracticeOptionButton
          index={index}
          isMultipleChoice={isMultipleChoice}
          isSelected={selectedOptionIndices.includes(index)}
          key={`${index}-${text.slice(0, 12)}`}
          onSelect={onSelect}
          text={text}
          visualState={resolveVisualState(
            index,
            answerState,
            selectedOptionIndices,
            correctOptionIndices,
          )}
        />
      ))}
    </section>
  );
}
