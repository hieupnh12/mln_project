import type { QuestionType } from "../types/question-library.types";

export const WAYGROUND_EXPORT_FILENAME_PREFIX = "wayground-ngan-hang-cau-hoi";

export const WAYGROUND_SHEET_NAME = "Create a Quiz";

export const WAYGROUND_HEADERS = [
  "Question Text",
  "Question Type",
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  "Option 5",
  "Correct Answer",
  "Time in seconds",
  "Image Link",
  "Answer explanation",
] as const;

/** Row 2 in Wayground template — instructional placeholders for import compatibility. */
export const WAYGROUND_INSTRUCTION_ROW: string[] = [
  "Text of the question\n\n(required)\n\n\n",
  "Question Type\n\n(default is Multiple Choice)\n\n",
  "Text for option 1\n\n(required in all cases except open-ended & draw questions)",
  "Text for option 2\n\n(required in all cases except open-ended & draw questions)",
  "Text for option 3\n\n(optional)\n\n\n",
  "Text for option 4\n\n(optional)\n\n\n",
  "Text for option 5\n\n(optional)\n\n\n",
  'The correct option choice (between 1-5).\n\nLeave blank for "Open-Ended", "Poll", "Draw" and "Fill-in-the-Blank".',
  "Time in seconds\n\n(optional, default value is 30 seconds)\n",
  "Link of the image\n\n(optional)\n\n\n",
  "Explanation for the answer\n(optional)\n\n\n",
];

export const WAYGROUND_QUESTION_TYPE_MAP: Record<QuestionType, string> = {
  "Trắc nghiệm": "Multiple Choice",
  "Nhiều đáp án": "Checkbox",
  "Đúng/Sai": "Multiple Choice",
  "Điền khuyết": "Fill-in-the-Blank",
  "Tự luận": "Open-Ended",
};

export const EXPORT_PAGE_SIZE = 100;

export const EXPORT_DETAIL_BATCH_SIZE = 10;

export const APPROVED_EXPORT_STATUS = "Đã xuất bản" as const;

export const PENDING_EXPORT_STATUS = "Cần duyệt" as const;
