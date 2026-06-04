import type { ExamSummary } from "../types/exam-summary.types";
import { normalizeExamSummary } from "./normalize-exam-summary";

export function getExamSummaryStorageKey(attemptId: string) {
  return `exam-summary:${attemptId}`;
}

export function saveExamSummary(attemptId: string, summary: ExamSummary) {
  sessionStorage.setItem(getExamSummaryStorageKey(attemptId), JSON.stringify(summary));
}

export function loadExamSummary(attemptId: string): ExamSummary | null {
  try {
    const raw = sessionStorage.getItem(getExamSummaryStorageKey(attemptId));
    if (!raw) {
      return null;
    }
    return normalizeExamSummary(JSON.parse(raw) as ExamSummary);
  } catch {
    return null;
  }
}
