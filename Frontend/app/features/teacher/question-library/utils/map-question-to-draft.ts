import { emptyQuestionDraft } from "../constants/question-library.constants";
import type { QuestionDraft, QuestionItem } from "../types/question-library.types";

function padOptions(options: string[]): string[] {
  const padded = [...options];
  while (padded.length < 4) {
    padded.push("");
  }
  return padded.slice(0, Math.max(4, options.length));
}

export function mapQuestionToDraft(question: QuestionItem): QuestionDraft {
  const correctOptionIndex =
    question.correctOptionIndices?.[0] ??
    question.options.findIndex((option) => option === question.answer);

  return {
    title: question.title,
    question: question.question,
    type: question.type,
    difficulty: question.difficulty,
    lessonId: question.lessonId,
    course: question.course,
    chapter: question.chapter,
    lesson: question.lesson,
    answer: question.answer,
    explanation: question.explanation ?? "",
    bloomLevel: emptyQuestionDraft.bloomLevel,
    correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
    score: question.score,
    estimatedTime: question.estimatedTime,
    tags: question.tags,
    options: question.options.length > 0 ? padOptions(question.options) : emptyQuestionDraft.options,
  };
}
