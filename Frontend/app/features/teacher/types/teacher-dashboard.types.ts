export type TeacherSectionId =
  | "dashboard"
  | "course-structure"
  | "pdf-documents"
  | "mindmap"
  | "flashcard"
  | "question-bank"
  | "quiz-management";

export type TeacherNavItem = {
  id: TeacherSectionId;
  label: string;
  icon: string;
};

export type Lesson = {
  title: string;
  icon: string;
};

export type Chapter = {
  id: string;
  order: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type MindmapNode = {
  title: string;
  description: string;
  children: string[];
};

export type FlashcardSet = {
  title: string;
  cards: number;
  status: string;
  accuracy: number;
};

export type QuestionType =
  | "Trắc nghiệm"
  | "Nhiều đáp án"
  | "Đúng/Sai"
  | "Điền khuyết"
  | "Tự luận";

export type Difficulty = "Cơ bản" | "Vận dụng" | "Nâng cao";
export type QuestionStatus = "Bản nháp" | "Cần duyệt" | "Đã xuất bản";

export type QuestionItem = {
  id: string;
  title: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  status: QuestionStatus;
  course: string;
  chapter: string;
  lesson: string;
  answer: string;
  score: number;
  estimatedTime: number;
  tags: string[];
  options: string[];
};

export type PdfDocument = {
  id: string;
  title: string;
  chapter: string;
  size: string;
  status: "Đã xuất bản" | "Bản nháp" | "Cần duyệt";
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
