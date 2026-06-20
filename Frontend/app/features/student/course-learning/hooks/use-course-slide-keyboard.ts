import { useEffect } from "react";

type UseCourseSlideKeyboardOptions = {
  activeIndex: number;
  enabled: boolean;
  isSlideLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
  totalSlides: number;
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

export function useCourseSlideKeyboard({
  activeIndex,
  enabled,
  isSlideLoading,
  onNext,
  onPrevious,
  totalSlides,
}: UseCourseSlideKeyboardOptions) {
  useEffect(() => {
    if (!enabled || totalSlides === 0) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowLeft" && activeIndex > 0 && !isSlideLoading) {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight" && activeIndex < totalSlides - 1 && !isSlideLoading) {
        event.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, enabled, isSlideLoading, onNext, onPrevious, totalSlides]);
}
