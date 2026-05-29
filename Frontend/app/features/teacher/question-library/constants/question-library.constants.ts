import type {
  Difficulty,
  QuestionDraft,
  QuestionItem,
  QuestionStatus,
  QuestionType,
} from "../types/question-library.types";

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

export const emptyQuestionDraft: QuestionDraft = {
  title: "",
  question: "",
  type: "Trắc nghiệm",
  difficulty: "Cơ bản",
  course: courseOptions[0],
  chapter: chapterOptions[0],
  lesson: lessonOptions[0],
  answer: "",
  score: 1,
  estimatedTime: 60,
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
    id: "Q001",
    title: "Vấn đề cơ bản của triết học",
    question: "Vấn đề cơ bản của triết học gồm những mặt nào?",
    type: "Trắc nghiệm",
    difficulty: "Cơ bản",
    status: "Đã xuất bản",
    course: courseOptions[0],
    chapter: "Chương 1",
    lesson: "Bài 1.1",
    answer: "Vật chất và ý thức",
    score: 1,
    estimatedTime: 60,
    tags: ["nhập môn", "triết học"],
    options: [
      "Vật chất và ý thức",
      "Kinh tế và chính trị",
      "Tự nhiên và xã hội",
      "Lý luận và thực tiễn",
    ],
  },
  {
    id: "Q002",
    title: "Vai trò của thực tiễn",
    question: "Phân tích vai trò của thực tiễn đối với nhận thức.",
    type: "Tự luận",
    difficulty: "Vận dụng",
    status: "Cần duyệt",
    course: courseOptions[0],
    chapter: "Chương 2",
    lesson: "Bài 2.1",
    answer:
      "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của chân lý.",
    score: 3,
    estimatedTime: 300,
    tags: ["nhận thức luận"],
    options: [],
  },
  {
    id: "Q003",
    title: "Quy luật lượng - chất",
    question: "Quy luật lượng - chất chỉ áp dụng trong tự nhiên.",
    type: "Đúng/Sai",
    difficulty: "Nâng cao",
    status: "Bản nháp",
    course: courseOptions[0],
    chapter: "Chương 3",
    lesson: "Bài 3.1",
    answer: "Sai",
    score: 2,
    estimatedTime: 90,
    tags: ["phép biện chứng"],
    options: ["Đúng", "Sai"],
  },
];
