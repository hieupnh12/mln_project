import type { PracticeModeSettings, PracticeQuestion, PracticeTestCard } from "../types/practice.types";

export const PRACTICE_QUERY_KEYS = {
  root: ["student", "practice"] as const,
  questions: (subjectId: number, chapterId: number | null, lessonId: number | null) =>
    ["student", "practice", "questions", subjectId, chapterId, lessonId] as const,
};

export const DEFAULT_PRACTICE_SETTINGS: PracticeModeSettings = {
  autoAdvance: false,
  requireContinue: true,
  autoAdvanceSeconds: 8,
};

export const PRACTICE_AUTO_SECONDS_OPTIONS = [5, 8, 12, 15] as const;

export const practiceTestCards: PracticeTestCard[] = [
  {
    id: "quick-ch1",
    title: "Kiểm tra nhanh Chương 1",
    description: "Luyện ngẫu nhiên trong phạm vi chương",
    questionCountLabel: "Ngân hàng câu hỏi",
    durationLabel: "Không giới hạn",
  },
  {
    id: "practice-ch2",
    title: "Luyện tập Chương 2",
    description: "Ôn tập theo từng bài trong chương",
    questionCountLabel: "Ngân hàng câu hỏi",
    durationLabel: "Không giới hạn",
  },
  {
    id: "midterm",
    title: "Đề tổng hợp giữa kỳ",
    description: "Toàn bộ môn học",
    questionCountLabel: "Ngân hàng câu hỏi",
    durationLabel: "45 phút",
  },
];

/** Mock bank until student practice API is available. */
export const practiceQuestionBank: PracticeQuestion[] = [
  {
    id: "P-001",
    questionNumber: 1,
    chapterId: null,
    lessonId: null,
    question:
      "Theo quan điểm của triết học Mác-Lênin, nguồn gốc trực tiếp và quan trọng nhất của ý thức là gì?",
    chapter: "Chương 1",
    lesson: "Bài 1.1",
    options: [
      "Sự tác động của thế giới khách quan vào bộ óc người.",
      "Lao động và ngôn ngữ.",
      "Sự phát triển của khoa học và kỹ thuật hiện đại.",
      "Sự phản ánh các hiện tượng tự nhiên vào tâm trí con người.",
    ],
    correctOptionIndex: 1,
    explanation:
      "Theo triết học Mác-Lênin, sự tác động của thế giới khách quan vào bộ óc người là nguồn gốc khách quan, còn lao động và ngôn ngữ là hai nguồn gốc trực tiếp và quan trọng nhất (nguồn gốc xã hội) quyết định sự hình thành và phát triển của ý thức.",
  },
  {
    id: "P-002",
    questionNumber: 2,
    chapterId: null,
    lessonId: null,
    question: "Vấn đề cơ bản của triết học gồm những mặt nào?",
    chapter: "Chương 1",
    lesson: "Bài 1.2",
    options: [
      "Bản thể luận và nhận thức luận",
      "Kinh tế và chính trị",
      "Tự nhiên và xã hội",
      "Lý luận và thực tiễn",
    ],
    correctOptionIndex: 0,
    explanation:
      "Vấn đề cơ bản của triết học là quan hệ giữa vật chất và ý thức, được thể hiện ở hai mặt: bản thể luận (vật chất hay ý thức có trước) và nhận thức luận (có thể nhận thức thế giới hay không).",
  },
  {
    id: "P-003",
    questionNumber: 3,
    chapterId: null,
    lessonId: null,
    question: "Chủ nghĩa duy vật biện chứng nghiên cứu điều gì?",
    chapter: "Chương 2",
    lesson: "Bài 2.1",
    options: [
      "Những quy luật chung nhất của tự nhiên, xã hội và tư duy",
      "Kinh tế và chính trị",
      "Tự nhiên và xã hội",
      "Lý luận và thực tiễn",
    ],
    correctOptionIndex: 0,
    explanation:
      "Chủ nghĩa duy vật biện chứng nghiên cứu những quy luật chung nhất của tự nhiên, xã hội và tư duy, coi thế giới vật chất vận động theo các quy luật khách quan.",
  },
  {
    id: "P-004",
    questionNumber: 4,
    chapterId: null,
    lessonId: null,
    question: "Vai trò của thực tiễn trong nhận thức là gì?",
    chapter: "Chương 2",
    lesson: "Bài 2.2",
    options: [
      "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý",
      "Thực tiễn chỉ là hoạt động kinh tế",
      "Thực tiễn không liên quan đến nhận thức",
      "Thực tiễn thay thế hoàn toàn lý luận",
    ],
    correctOptionIndex: 0,
    explanation:
      "Theo quan điểm Mác-Lênin, thực tiễn có vai trò cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý trong quá trình nhận thức.",
  },
  {
    id: "P-005",
    questionNumber: 5,
    chapterId: null,
    lessonId: null,
    question:
      "Theo quan điểm duy vật biện chứng, bản chất của sự vận động là gì?",
    chapter: "Chương 3",
    lesson: "Bài 3.1",
    options: [
      "Sự vận động tự thân, vĩnh viễn và phổ biến",
      "Sự vận động do ý thức con người quyết định",
      "Sự vận động chỉ xảy ra trong tự nhiên",
      "Sự vận động là tạm thời và hữu hạn",
    ],
    correctOptionIndex: 0,
    explanation:
      "Duy vật biện chứng khẳng định vận động là thuộc tính tự thân, vĩnh viễn và phổ biến của vật chất; không có vật chất nào đứng yên tuyệt đối.",
  },
];
