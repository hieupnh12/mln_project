import { useEffect } from "react";

import type { PracticeAnswerState } from "../types/practice.types";
import { isEditableKeyboardTarget } from "../utils/is-editable-keyboard-target";
import { resolvePracticeOptionHotkey } from "../utils/resolve-practice-option-hotkey";

type UsePracticeKeyboardOptions = {
  enabled: boolean;
  optionCount: number;
  answerState: PracticeAnswerState;
  isMultipleChoice: boolean;
  hasSelection: boolean;
  onSelectOption: (index: number) => void;
  onSubmitAnswer: () => void;
  onContinue: () => void;
};

export function usePracticeKeyboard({
  enabled,
  optionCount,
  answerState,
  isMultipleChoice,
  hasSelection,
  onSelectOption,
  onSubmitAnswer,
  onContinue,
}: UsePracticeKeyboardOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableKeyboardTarget(event.target)) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const optionIndex = resolvePracticeOptionHotkey(event);
      if (
        optionIndex != null
        && optionIndex < optionCount
        && answerState === "idle"
      ) {
        event.preventDefault();
        onSelectOption(optionIndex);
        return;
      }

      const isEnter = event.key === "Enter";
      const isSpace = event.key === " " || event.code === "Space";
      const isNextKey =
        event.key === "ArrowRight"
        || event.key === "n"
        || event.key === "N";

      if (answerState === "answered" && (isEnter || isSpace || isNextKey)) {
        event.preventDefault();
        onContinue();
        return;
      }

      if (
        answerState === "idle"
        && isMultipleChoice
        && hasSelection
        && isEnter
      ) {
        event.preventDefault();
        onSubmitAnswer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    answerState,
    enabled,
    hasSelection,
    isMultipleChoice,
    onContinue,
    onSelectOption,
    onSubmitAnswer,
    optionCount,
  ]);
}
