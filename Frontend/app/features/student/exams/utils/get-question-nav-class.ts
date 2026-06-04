import type { QuestionNavState } from "../types/exam-session.types";

export function getQuestionNavClass(state: QuestionNavState): string {
  const base =
    "relative flex aspect-square items-center justify-center rounded-md text-label-md font-medium transition-transform hover:scale-105";

  switch (state) {
    case "answered":
      return `${base} bg-secondary text-on-secondary`;
    case "current":
      return `${base} border-2 border-secondary bg-secondary-container/40 font-bold text-secondary shadow-sm`;
    case "flagged":
      return `${base} bg-secondary text-on-secondary`;
    default:
      return `${base} border border-secondary/30 bg-surface-container-lowest text-primary hover:bg-secondary-container/30`;
  }
}
