import type { QuizListItem, QuizStatus } from "../types/quiz-management.types";

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
      hint: "Tên quiz cần ít nhất 3 ký tự.",
    },
    {
      id: "questions",
      label: "Số câu hỏi",
      passed: questionCount >= 1,
      hint: "Thêm ít nhất 1 câu hỏi ở tab Câu hỏi.",
    },
    {
      id: "duration",
      label: "Thời gian làm bài",
      passed: duration >= 5,
      hint: "Thời gian tối thiểu 5 phút.",
    },
    {
      id: "passing",
      label: "Điểm đạt",
      passed: passingScore >= 1 && passingScore <= 100,
      hint: "Điểm đạt trong khoảng 1–100%.",
    },
  ];
}

export function isQuizReadyForPublish(checks: QuizReadinessCheck[]): boolean {
  return checks.every((check) => check.passed);
}

export function formatQuizScope(course: string, chapter: string, lesson: string): string {
  const lessonLabel = lesson === "all" ? "Tất cả bài" : lesson;
  return `${course} · ${chapter} · ${lessonLabel}`;
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
  if (status === "all") return "Mọi trạng thái";
  return status;
}
