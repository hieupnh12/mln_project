import type { QuizListItem, QuizStatus } from "../types/quiz-management.types";

export function hasActiveCandidateFilter(search: string, difficulty: string) {
  return search.trim().length > 0 || difficulty !== "all";
}

export type QuizListSummary = {
  total: number;
  draftCount: number;
  publishedCount: number;
  totalQuestions: number;
  avgDuration: number;
};

export function computeQuizListSummary(items: QuizListItem[]): QuizListSummary {
  const draftCount = items.filter((quiz) => quiz.status === "Bản nháp").length;
  const publishedCount = items.filter((quiz) => quiz.status === "Đã xuất bản").length;
  const totalQuestions = items.reduce((sum, quiz) => sum + quiz.questionCount, 0);
  const avgDuration =
    items.length === 0
      ? 0
      : Math.round(items.reduce((sum, quiz) => sum + quiz.duration, 0) / items.length);

  return {
    total: items.length,
    draftCount,
    publishedCount,
    totalQuestions,
    avgDuration,
  };
}

export type QuizReadinessCheck = {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
};

export function getQuizReadinessChecks(
  title: string,
  questionCount: number,
  duration: number,
  passingScore: number,
): QuizReadinessCheck[] {
  return [
    {
      id: "title",
      label: "Tên quiz",
      passed: title.trim().length >= 3,
      hint: "Tên ≥ 3 ký tự.",
    },
    {
      id: "questions",
      label: "Số câu hỏi",
      passed: questionCount >= 1,
      hint: "Thêm ≥ 1 câu.",
    },
    {
      id: "duration",
      label: "Thời gian",
      passed: duration >= 5,
      hint: "≥ 5 phút.",
    },
    {
      id: "passing",
      label: "Điểm đạt",
      passed: passingScore >= 1 && passingScore <= 100,
      hint: "1–100%.",
    },
  ];
}

export function isQuizReadyForPublish(checks: QuizReadinessCheck[]): boolean {
  return checks.every((check) => check.passed);
}

export function formatQuizScope(course: string, chapter: string, lesson: string): string {
  const chapterLabel = chapter === "all" || !chapter ? "Tất cả ch" : chapter;
  const lessonLabel = lesson === "all" || !lesson ? "Tất cả bài" : lesson;
  return `${course} · ${chapterLabel} · ${lessonLabel}`;
}

export function formatCloseDeadline(value: string | undefined): string {
  if (!value?.trim()) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  const diffMs = Date.now() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return isoDate;
}

export function filterStatusLabel(status: "all" | QuizStatus): string {
  if (status === "all") return "TT";
  if (status === "Bản nháp") return "Nháp";
  if (status === "Đã xuất bản") return "Live";
  if (status === "Đã tắt") return "Tắt";
  return status;
}
