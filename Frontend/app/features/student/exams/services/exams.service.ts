import {
  fetchExamCatalog,
  fetchExamReview,
  fetchExamSession,
  fetchExamSummary,
  submitExam,
} from "../api/exams.api";
import type { ExamCatalog } from "../types/exams.types";
import type { ExamReview } from "../types/exam-review.types";
import type { ExamSummary } from "../types/exam-summary.types";
import type { ExamSession } from "../types/exam-session.types";
import type {
  SubmitExamAnswerDto,
  SubmitExamResultDto,
} from "../types/exam-session-api.types";
import { mapExamCatalogDto } from "../utils/map-exam-catalog-dto";

export async function getExamCatalog(
  subjectId: number,
  completedLimit = 50,
): Promise<ExamCatalog> {
  const dto = await fetchExamCatalog(subjectId, completedLimit);
  return mapExamCatalogDto(dto);
}

export async function getExamSession(
  subjectId: number,
  quizId: string,
): Promise<ExamSession> {
  return fetchExamSession(subjectId, quizId);
}

export async function submitExamAttempt(
  subjectId: number,
  quizId: string,
  studentId: number,
  questionIds: string[],
  answers: SubmitExamAnswerDto[],
  elapsedSeconds: number,
): Promise<SubmitExamResultDto> {
  return submitExam(subjectId, quizId, { studentId, elapsedSeconds, questionIds, answers });
}

export async function getExamSummary(
  subjectId: number,
  attemptId: string,
): Promise<ExamSummary> {
  return fetchExamSummary(subjectId, attemptId);
}

export async function getExamReview(
  subjectId: number,
  attemptId: string,
): Promise<ExamReview> {
  return fetchExamReview(subjectId, attemptId);
}
