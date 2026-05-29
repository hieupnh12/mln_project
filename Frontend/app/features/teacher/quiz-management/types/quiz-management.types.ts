export type QuizSettings = {
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  randomCount: number;
  shuffleAnswers: boolean;
  randomQuestions: boolean;
};

export type QuizItem = {
  id: string;
  title: string;
  course: string;
  chapter: string;
  questionCount: number;
  duration: number;
  passingScore: number;
  status: "Đã xuất bản" | "Bản nháp";
  shuffleAnswers: boolean;
  randomQuestions: boolean;
};
