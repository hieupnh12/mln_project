import type { ExamDifficultySlice, ExamSummary } from "../types/exam-summary.types";

function normalizeSlice(slice: ExamDifficultySlice): ExamDifficultySlice {
  const sharePercent = slice.sharePercent ?? slice.percent ?? 0;
  return {
    ...slice,
    correctCount: slice.correctCount ?? 0,
    sharePercent,
    percent: slice.percent ?? 0,
  };
}

/** Chuẩn hóa dữ liệu cache cũ sau khi mở rộng API. */
export function normalizeExamSummary(summary: ExamSummary): ExamSummary {
  return {
    ...summary,
    passingScore: summary.passingScore ?? 70,
    durationMinutes: summary.durationMinutes ?? 45,
    elapsedSeconds: summary.elapsedSeconds ?? 0,
    submittedAt: summary.submittedAt ?? "",
    difficultyBreakdown: (summary.difficultyBreakdown ?? []).map(normalizeSlice),
  };
}
