import type { ExamDraft } from "../types/exam-session.types";

export function getExamDraftKey(courseId: string, quizId: string, studentId?: string) {
  return `exam-draft:${courseId}:${quizId}:${studentId ?? "guest"}`;
}

export function loadExamDraft(key: string): ExamDraft | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as ExamDraft;
  } catch {
    return null;
  }
}

export function saveExamDraft(key: string, draft: ExamDraft) {
  try {
    localStorage.setItem(key, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearExamDraft(key: string) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
