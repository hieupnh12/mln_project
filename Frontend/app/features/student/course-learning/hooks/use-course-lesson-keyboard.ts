import { useEffect } from "react";

type UseCourseLessonKeyboardOptions = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  enabled: boolean;
  onGoToNextLesson: () => void;
  onGoToPreviousLesson: () => void;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

export function useCourseLessonKeyboard({
  canGoNext,
  canGoPrevious,
  enabled,
  onGoToNextLesson,
  onGoToPreviousLesson,
}: UseCourseLessonKeyboardOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      const useLessonShortcut = event.shiftKey || event.altKey;

      if (!useLessonShortcut) {
        return;
      }

      if (event.key === "ArrowLeft" && canGoPrevious) {
        event.preventDefault();
        onGoToPreviousLesson();
        return;
      }

      if (event.key === "ArrowRight" && canGoNext) {
        event.preventDefault();
        onGoToNextLesson();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoNext, canGoPrevious, enabled, onGoToNextLesson, onGoToPreviousLesson]);
}
