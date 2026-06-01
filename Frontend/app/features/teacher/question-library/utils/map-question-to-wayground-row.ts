import { WAYGROUND_QUESTION_TYPE_MAP } from "../constants/wayground-export.constants";
import type { QuestionItem } from "../types/question-library.types";

export type WaygroundExportRow = {
  questionText: string;
  questionType: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  correctAnswer: string | number;
  timeInSeconds: number;
  imageLink: string;
  answerExplanation: string;
};

function normalizeOptions(options: string[]) {
  const normalized = options.map((option) => option.trim()).filter(Boolean);
  while (normalized.length < 5) {
    normalized.push("");
  }
  return normalized.slice(0, 5);
}

function resolveCorrectIndices(question: QuestionItem): number[] {
  if (question.correctOptionIndices && question.correctOptionIndices.length > 0) {
    return question.correctOptionIndices;
  }

  const options = question.options.map((option) => option.trim()).filter(Boolean);
  const answer = question.answer.trim();
  if (!answer) {
    return [];
  }

  const letterMatch = answer.match(/^([A-Ea-e])$/);
  if (letterMatch) {
    const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    return index >= 0 && index < options.length ? [index] : [];
  }

  const commaParts = answer.split(",").map((part) => part.trim()).filter(Boolean);
  if (commaParts.length > 1 && commaParts.every((part) => /^\d+$/.test(part))) {
    return commaParts
      .map((part) => Number(part) - 1)
      .filter((index) => index >= 0 && index < options.length);
  }

  const matchedIndex = options.findIndex(
    (option) => option.localeCompare(answer, "vi", { sensitivity: "accent" }) === 0,
  );
  return matchedIndex >= 0 ? [matchedIndex] : [];
}

function resolveCorrectAnswer(question: QuestionItem, options: string[]): string | number {
  if (question.type === "Tự luận" || question.type === "Điền khuyết") {
    return "";
  }

  const indices = resolveCorrectIndices(question);
  if (indices.length === 0) {
    return "";
  }

  if (question.type === "Nhiều đáp án") {
    return indices.map((index) => index + 1).join(",");
  }

  return indices[0] + 1;
}

export function mapQuestionToWaygroundRow(
  question: QuestionItem,
  options: { includeExplanation: boolean; timePerQuestionSeconds: number },
): WaygroundExportRow {
  const normalizedOptions = normalizeOptions(question.options);

  return {
    questionText: question.question.trim(),
    questionType: WAYGROUND_QUESTION_TYPE_MAP[question.type],
    option1: normalizedOptions[0] ?? "",
    option2: normalizedOptions[1] ?? "",
    option3: normalizedOptions[2] ?? "",
    option4: normalizedOptions[3] ?? "",
    option5: normalizedOptions[4] ?? "",
    correctAnswer: resolveCorrectAnswer(question, normalizedOptions),
    timeInSeconds: options.timePerQuestionSeconds,
    imageLink: "",
    answerExplanation: options.includeExplanation ? (question.explanation?.trim() ?? "") : "",
  };
}

export function waygroundRowToValues(row: WaygroundExportRow): Array<string | number> {
  return [
    row.questionText,
    row.questionType,
    row.option1,
    row.option2,
    row.option3,
    row.option4,
    row.option5,
    row.correctAnswer,
    row.timeInSeconds,
    row.imageLink,
    row.answerExplanation,
  ];
}
