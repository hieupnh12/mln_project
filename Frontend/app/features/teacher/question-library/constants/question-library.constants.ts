import type { QuestionFilters } from "../types/question-library.types";
import type {
  Difficulty,
  QuestionDraft,
  QuestionItem,
  QuestionStatus,
  QuestionType,
} from "../types/question-library.types";

/** Paths relative to api client base (`/api` in dev via Vite proxy → backend `/mlnStudy/api`). */
export const QUESTION_LIBRARY_ENDPOINTS = {
  metadata: "/teacher/question-library/metadata",
  questions: "/teacher/question-library/questions",
  stats: "/teacher/question-library/stats",
  batchImport: "/teacher/question-library/questions/batch-import",
  checkDuplicate: "/teacher/question-library/questions/check-duplicate",
  questionById: (id: string) => `/teacher/question-library/questions/${id}`,
} as const;

export const QUESTION_LIBRARY_QUERY_KEYS = {
  root: ["teacher", "question-library"] as const,
  metadata: ["teacher", "question-library", "metadata"] as const,
  stats: ["teacher", "question-library", "stats"] as const,
  questions: (filters: QuestionFilters, page: number, size: number) =>
    ["teacher", "question-library", "questions", filters, page, size] as const,
  question: (id: string) => ["teacher", "question-library", "question", id] as const,
};

export const QUESTION_PAGE_SIZE = 10;

export const defaultQuestionFilters = {
  search: "",
  course: "all",
  chapter: "all",
  lesson: "all",
  difficulty: "all",
  type: "all",
  status: "all",
} as const;

export const courseOptions = [
  "Triết học Mác - Lênin",
  "Kinh tế chính trị Mác - Lênin",
  "Chủ nghĩa xã hội khoa học",
];

export const chapterOptions = ["Chương 1", "Chương 2", "Chương 3", "Chương 4"];
export const lessonOptions = ["Bài 1.1", "Bài 1.2", "Bài 2.1", "Bài 3.1"];
export const difficultyOptions: Difficulty[] = ["Cơ bản", "Vận dụng", "Nâng cao"];
export const questionTypeOptions: QuestionType[] = [
  "Trắc nghiệm",
  "Nhiều đáp án",
  "Đúng/Sai",
  "Điền khuyết",
  "Tự luận",
];
export const questionStatusOptions: QuestionStatus[] = [
  "Bản nháp",
  "Cần duyệt",
  "Đã xuất bản",
];

export const statusDisplayLabels: Record<QuestionStatus, string> = {
  "Bản nháp": "Bản nháp",
  "Cần duyệt": "Cần duyệt",
  "Đã xuất bản": "Đã duyệt",
};

export const emptyQuestionDraft: QuestionDraft = {
  title: "",
  question: "",
  type: "Trắc nghiệm",
  difficulty: "Vận dụng",
  lessonId: undefined,
  course: "",
  chapter: "",
  lesson: "",
  answer: "",
  explanation: "",
  bloomLevel: "Hiểu",
  correctOptionIndex: 0,
  score: 1,
  estimatedTime: 60,
  tags: [],
  options: ["", "", "", ""],
};

export const sampleQuestionBatch = `Q: Chủ nghĩa duy vật biện chứng nghiên cứu điều gì?
A: Những quy luật chung nhất của tự nhiên, xã hội và tư duy
Course: Triết học Mác - Lênin
Chapter: Chương 2
Lesson: Bài 2.1
Difficulty: Cơ bản
Type: Trắc nghiệm`;

export const questionItems: QuestionItem[] = [
  {
    id: "Q-1024",
    title: "Chủ nghĩa duy vật biện chứng nghiên cứu điều gì?",
    question: "Chủ nghĩa duy vật biện chứng nghiên cứu điều gì?",
    type: "Trắc nghiệm",
    difficulty: "Cơ bản",
    status: "Đã xuất bản",
    course: courseOptions[0],
    chapter: "Chương 2",
    lesson: "Bài 2.1",
    answer: "Những quy luật chung nhất của tự nhiên, xã hội và tư duy",
    score: 1,
    estimatedTime: 60,
    tags: ["dialetics", "basic"],
    options: [
      "Những quy luật chung nhất của tự nhiên, xã hội và tư duy",
      "Kinh tế và chính trị",
      "Tự nhiên và xã hội",
      "Lý luận và thực tiễn",
    ],
    updatedBy: "TS. Trần Văn B",
  },
  {
    id: "Q-1025",
    title:
      "Vai trò của sản xuất vật chất đối với sự tồn tại và phát triển của xã hội?",
    question:
      "Vai trò của sản xuất vật chất đối với sự tồn tại và phát triển của xã hội?",
    type: "Tự luận",
    difficulty: "Vận dụng",
    status: "Đã xuất bản",
    course: courseOptions[0],
    chapter: "Chương 3",
    lesson: "Bài 3.1",
    answer:
      "Sản xuất vật chất là cơ sở tồn tại và phát triển của mọi hình thái xã hội.",
    score: 3,
    estimatedTime: 300,
    tags: ["lịch sử"],
    options: [],
    updatedBy: "TS. Trần Văn B",
  },
  {
    id: "Q-1026",
    title:
      "Phân tích mối quan hệ giữa lực lượng sản xuất và quan hệ sản xuất.",
    question:
      "Phân tích mối quan hệ giữa lực lượng sản xuất và quan hệ sản xuất.",
    type: "Tự luận",
    difficulty: "Nâng cao",
    status: "Bản nháp",
    course: courseOptions[0],
    chapter: "Chương 3",
    lesson: "Bài 3.1",
    answer: "",
    score: 4,
    estimatedTime: 420,
    tags: ["marx", "advanced"],
    options: [],
    updatedBy: "GS. Đặng Văn A",
  },
  {
    id: "Q-1027",
    title: "Vấn đề cơ bản của triết học",
    question: "Vấn đề cơ bản của triết học gồm những mặt nào?",
    type: "Trắc nghiệm",
    difficulty: "Cơ bản",
    status: "Cần duyệt",
    course: courseOptions[1],
    chapter: "Chương 1",
    lesson: "Bài 1.1",
    answer: "Vật chất và ý thức",
    score: 1,
    estimatedTime: 60,
    tags: ["nhập môn"],
    options: ["Vật chất và ý thức", "Kinh tế và chính trị", "Tự nhiên và xã hội"],
    updatedBy: "TS. Lê Thị C",
  },
];
