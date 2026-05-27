import type {
  Chapter,
  Difficulty,
  FlashcardSet,
  MindmapNode,
  PdfDocument,
  QuestionItem,
  QuestionStatus,
  QuestionType,
  QuizItem,
  TeacherNavItem,
} from "../types/teacher-dashboard.types";

export const teacherProfile = {
  name: "Giảng viên Nguyen",
  plan: "Premium Account",
  course: "Triết học Mác - Lênin",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCTFytM8KmPcZ84-Wke_b1yd7MqgYKPlE9YURylBtsU3O04MZ0TGkMLaQiTcWcMVK99JVZdVOtRIr6fKqKFh8k3rmjrQW2nFSfx6AN64uPU_v8Qed1k1Sw4t1S2KyrqrpmQTLlc4DrfKsHHMUlbDR8pi22RYTnatW9rg86ig8kQCCaXmT3jw6Lcvz06AzIv47VK4za9GreHA8PzXW7d8gVBdEd81elfDL-mAlx_7s-Jh370s8l7GK2kWt7o2hq2fPTaIny4tRpGIHL7",
};

export const teacherNavItems: TeacherNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "course-structure", label: "Cấu trúc khóa học", icon: "account_tree" },
  { id: "pdf-documents", label: "Tài liệu PDF", icon: "picture_as_pdf" },
  { id: "mindmap", label: "Mindmap", icon: "hub" },
  { id: "flashcard", label: "Flashcard", icon: "quiz" },
  { id: "question-bank", label: "Ngân hàng câu hỏi", icon: "database" },
  { id: "quiz-management", label: "Quản lý Quiz", icon: "task" },
];

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

export const chapters: Chapter[] = [
  {
    id: "chapter-1",
    order: "01",
    title: "Khái lược về Triết học Mác - Lênin",
    summary: "4 bài học - 120 phút tổng cộng",
    lessons: [
      { title: "1.1 Tổng quan về triết học và thế giới quan", icon: "play_circle" },
      { title: "1.2 Vấn đề cơ bản của triết học", icon: "description" },
      { title: "1.3 Vai trò của triết học trong đời sống", icon: "article" },
    ],
  },
  {
    id: "chapter-2",
    order: "02",
    title: "Chủ nghĩa duy vật biện chứng",
    summary: "6 bài học - 180 phút tổng cộng",
    lessons: [],
  },
  {
    id: "chapter-3",
    order: "03",
    title: "Phép biện chứng duy vật",
    summary: "5 bài học - 150 phút tổng cộng",
    lessons: [],
  },
];

export const teacherVisualCards = [
  {
    label: "Phân tích",
    title: "Thống kê học tập",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCv-a1XZpQZz5Fhp6wbtr-ZG-eO5pdB_HOI5vLDxxKOEBAQ8KxPOHER4veYJRU78Q6aR1whvtmjoiwkP1w-2-P3WWaY6nA6idyXYmAp4jf0UnW9R6XnstUQSRK75zaxdqnAnA_C6MqHFuyEUAGFXQCpMXu3EFl-Qy4aGNA3oiVbvDV_0iH-XKNwX9rTMp-R8U4s9ZnMYzJJn_WjpEV0p2qaimVsP62UUr81IDwt8ajz3EjlFpGeb8U6HxdaVCsHmTjz-KsT41yINtIj",
  },
  {
    label: "Cộng đồng",
    title: "Thảo luận lớp học",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLdAYqdr63ac7QjvUBeIbCCzw7ABnGWW0Ldp0UAnX5NEDUN0oONBxG8WEpcUrdganRLpg4njl91UIelNvZrH5YCkxKuyiWRCLpDIt7UfuRzKi7gn_bv0xVr_20vMEJYwVSeIbUhaI8WCw2Pc0cWdslQGIb10QZqwrFAnkMpP-pKjYCp22lw5i87sSEgDYUMjHJ8XjkERGBg3-sWCDt_UhABUMWqBAkNEvQJi4xaSPO0uk6sS5la7rRBFxwKD43kfYEPgve7Ucau1fe",
  },
];

export const mindmapNodes: MindmapNode[] = [
  {
    title: "Triết học Mác - Lênin",
    description: "Khung kiến thức trung tâm của học phần.",
    children: ["Vật chất & ý thức", "Phép biện chứng", "Nhận thức luận"],
  },
  {
    title: "Vật chất & ý thức",
    description: "Mối quan hệ nền tảng trong vấn đề cơ bản của triết học.",
    children: ["Tính thứ nhất", "Sự phản ánh", "Vai trò thực tiễn"],
  },
  {
    title: "Phép biện chứng",
    description: "Các nguyên lý, quy luật và cặp phạm trù phổ biến.",
    children: ["Mâu thuẫn", "Lượng - chất", "Phủ định"],
  },
];

export const flashcardSets: FlashcardSet[] = [
  { title: "Khái niệm nền tảng", cards: 36, status: "Đã xuất bản", accuracy: 82 },
  { title: "Quy luật phép biện chứng", cards: 28, status: "Bản nháp", accuracy: 74 },
  { title: "Nhận thức luận", cards: 18, status: "Cần rà soát", accuracy: 69 },
];

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
    options: ["Vật chất và ý thức", "Kinh tế và chính trị", "Tự nhiên và xã hội", "Lý luận và thực tiễn"],
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
    answer: "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của chân lý.",
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

export const pdfDocuments: PdfDocument[] = [
  { id: "PDF01", title: "Đề cương học phần", chapter: "Tổng quan", size: "2.4 MB", status: "Đã xuất bản" },
  { id: "PDF02", title: "Tài liệu chương 1", chapter: "Chương 1", size: "5.1 MB", status: "Bản nháp" },
  { id: "PDF03", title: "Bài đọc mở rộng", chapter: "Chương 2", size: "3.8 MB", status: "Cần duyệt" },
];

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
