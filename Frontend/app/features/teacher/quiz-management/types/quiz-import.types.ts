import type { BatchImportPayload, BatchImportReportDto } from "../../question-library/types/question-library-api.types";
import type { QuizDetailDto } from "./quiz-management-api.types";

export type ImportExamQuizConfig = {
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  shuffleAnswers: boolean;
  timePerQuestionSeconds: number;
};

export type ImportExamAsQuizPayload = BatchImportPayload &
  Pick<
    ImportExamQuizConfig,
    "title" | "course" | "chapter" | "lesson" | "duration" | "passingScore" | "shuffleAnswers"
  >;

export type ImportExamAsQuizResultDto = {
  quiz: QuizDetailDto;
  importReport: BatchImportReportDto;
};
