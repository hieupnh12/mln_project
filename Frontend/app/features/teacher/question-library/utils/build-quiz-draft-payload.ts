import type { SaveQuizPayload } from "../../quiz-management/types/quiz-management-api.types";
import type { ExportConfig, RandomExamConfig } from "../types/export-exam.types";
import type { QuestionItem } from "../types/question-library.types";

function resolveQuizChapter(scope: RandomExamConfig["scope"], questions: QuestionItem[]): string {
  if (scope.chapterTitles.length > 0) {
    return scope.chapterTitles[0];
  }
  return questions[0]?.chapter ?? "";
}

function resolveQuizLesson(scope: RandomExamConfig["scope"], questions: QuestionItem[]): string {
  if (scope.lessonIds.length === 1) {
    const matched = questions.find((item) => item.lessonId === scope.lessonIds[0]);
    return matched?.lesson ?? "all";
  }
  return "all";
}

export function buildQuizDraftPayload(
  randomConfig: RandomExamConfig,
  questions: QuestionItem[],
  exportConfig: ExportConfig,
): SaveQuizPayload {
  const stamp = new Date().toLocaleDateString("vi-VN");
  const durationMinutes = Math.max(
    5,
    Math.ceil((questions.length * exportConfig.timePerQuestionSeconds) / 60),
  );

  return {
    title: `Đề random · ${randomConfig.scope.subjectTitle} · ${stamp}`,
    course: randomConfig.scope.subjectTitle,
    chapter: resolveQuizChapter(randomConfig.scope, questions),
    lesson: resolveQuizLesson(randomConfig.scope, questions),
    duration: durationMinutes,
    passingScore: 70,
    randomCount: randomConfig.totalCount,
    shuffleAnswers: true,
    randomQuestions: true,
    questionIds: questions.map((item) => item.id),
  };
}
