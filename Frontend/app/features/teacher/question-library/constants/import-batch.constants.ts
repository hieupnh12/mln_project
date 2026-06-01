import type { ImportPreviewRow } from "../types/import-batch.types";

export const IMPORT_TEMPLATE_FILENAME = "mau-import-cau-hoi.xlsx";

export const IMPORT_TEMPLATE_SHEET_NAME = "Cau hoi";

/** Column headers in the Excel template (row 1). Keys match import field mapping. */
export const IMPORT_TEMPLATE_HEADERS = [
  "subject",
  "chapter",
  "lesson",
  "content",
  "type",
  "difficulty",
  "tags",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
] as const;

export const IMPORT_TEMPLATE_HEADER_LABELS: Record<(typeof IMPORT_TEMPLATE_HEADERS)[number], string> = {
  subject: "Môn học",
  chapter: "Chương",
  lesson: "Bài học",
  content: "Nội dung câu hỏi",
  type: "Loại câu hỏi",
  difficulty: "Độ khó",
  tags: "Thẻ (phân cách bằng dấu phẩy)",
  option_a: "Đáp án A",
  option_b: "Đáp án B",
  option_c: "Đáp án C",
  option_d: "Đáp án D",
  correct_answer: "Đáp án đúng",
  explanation: "Giải thích",
};

export const IMPORT_TEMPLATE_SAMPLE_ROWS: Record<(typeof IMPORT_TEMPLATE_HEADERS)[number], string>[] = [
  {
    subject: "Triết học Mác - Lênin",
    chapter: "Khái lược về Triết Học Mác -lenin",
    lesson: "Khái niệm nền tảng",
    content: "Chủ nghĩa duy vật biện chứng nghiên cứu đối tượng nào?",
    type: "Trắc nghiệm",
    difficulty: "Cơ bản",
    tags: "Triết học, MLN",
    option_a: "Tự nhiên, xã hội và tư duy",
    option_b: "Kinh tế và chính trị",
    option_c: "Lịch sử và văn hóa",
    option_d: "Triết học và tôn giáo",
    correct_answer: "Tự nhiên, xã hội và tư duy",
    explanation: "CNDVBC nghiên cứu quy luật chung nhất của thế giới khách quan và tư duy con người.",
  },
  {
    subject: "Triết học Mác - Lênin",
    chapter: "Khái lược về Triết Học Mác -lenin",
    lesson: "Quy luật phép biện chứng",
    content: "Vai trò của lực lượng sản xuất trong phát triển xã hội?",
    type: "Tự luận",
    difficulty: "Vận dụng",
    tags: "Kinh tế chính trị",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    explanation: "Phân tích vai trò quyết định của sản xuất vật chất đối với sự tồn tại xã hội.",
  },
  {
    subject: "",
    chapter: "",
    lesson: "",
    content: "Quy luật lượng - chất chỉ áp dụng trong tự nhiên.",
    type: "Đúng/Sai",
    difficulty: "Nâng cao",
    tags: "Phép biện chứng",
    option_a: "Đúng",
    option_b: "Sai",
    option_c: "",
    option_d: "",
    correct_answer: "Sai",
    explanation: "Quy luật lượng - chất vận dụng trong tự nhiên, xã hội và tư duy.",
  },
];

export const IMPORT_TYPE_OPTIONS = [
  "Trắc nghiệm",
  "Nhiều đáp án",
  "Đúng/Sai",
  "Điền khuyết",
  "Tự luận",
] as const;

export const IMPORT_DIFFICULTY_OPTIONS = ["Cơ bản", "Vận dụng", "Nâng cao"] as const;

export const IMPORT_ANSWER_LETTER_OPTIONS = ["A", "B", "C", "D"] as const;

export const importPreviewRows: ImportPreviewRow[] = [
  {
    id: "row-1",
    content: "Chủ nghĩa duy vật biện chứng nghiên cứu đối tượng nào?",
    type: "mcq",
    typeLabel: "Trắc nghiệm",
    difficulty: "Cơ bản",
    tags: "Triết học, MLN",
  },
  {
    id: "row-2",
    content: "Vai trò của lực lượng sản xuất trong phát triển xã hội?",
    type: "essay",
    typeLabel: "Tự luận",
    difficulty: "Vận dụng",
    tags: "Kinh tế chính trị",
  },
  {
    id: "row-3",
    content: "Quy luật lượng - chất chỉ áp dụng trong tự nhiên.",
    type: "truefalse",
    typeLabel: "Đúng/Sai",
    difficulty: "Nâng cao",
    tags: "Phép biện chứng",
  },
  {
    id: "row-4",
    content: "Khái niệm thực tiễn trong triết học Mác - Lênin là gì?",
    type: "short",
    typeLabel: "Điền khuyết",
    difficulty: "Cơ bản",
    tags: "Nhận thức luận",
  },
  {
    id: "row-5",
    content: "Phân tích mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng.",
    type: "essay",
    typeLabel: "Tự luận",
    difficulty: "Nâng cao",
    tags: "CĐVHL, Phân tích",
  },
];

export const IMPORT_SUCCESS_COUNT = 42;
