import {
  chapterOptions,
  courseOptions,
} from "../../question-library/constants/question-library.constants";
import type { QuizItem, QuizSettings } from "../types/quiz-management.types";

export const defaultQuizSettings: QuizSettings = {
  title: "Quiz chương 1",
  course: courseOptions[0],
  chapter: chapterOptions[0],
  lesson: "all",
  duration: 20,
  passingScore: 70,
  randomCount: 10,
  shuffleAnswers: true,
  randomQuestions: false,
};

export const quizItems: QuizItem[] = [
  {
    id: "QUIZ01",
    title: "Quiz chương 1",
    course: courseOptions[0],
    chapter: "Chương 1",
    questionCount: 12,
    duration: 15,
    passingScore: 70,
    status: "Đã xuất bản",
    shuffleAnswers: true,
    randomQuestions: false,
  },
  {
    id: "QUIZ02",
    title: "Ôn tập giữa kỳ",
    course: courseOptions[0],
    chapter: "Chương 1-3",
    questionCount: 30,
    duration: 45,
    passingScore: 75,
    status: "Bản nháp",
    shuffleAnswers: true,
    randomQuestions: true,
  },
];
