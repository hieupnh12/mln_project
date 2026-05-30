import { importPreviewRows } from "../constants/import-batch.constants";
import { emptyQuestionDraft, courseOptions } from "../constants/question-library.constants";
import type { QuestionItem } from "../types/question-library.types";
import { createQuestionFromDraft } from "./question-library-mutations";

const typeMap: Record<string, QuestionItem["type"]> = {
  mcq: "Trắc nghiệm",
  essay: "Tự luận",
  truefalse: "Đúng/Sai",
  short: "Điền khuyết",
};

const difficultyMap: Record<string, QuestionItem["difficulty"]> = {
  "Cơ bản": "Cơ bản",
  "Vận dụng": "Vận dụng",
  "Nâng cao": "Nâng cao",
  Easy: "Cơ bản",
  Medium: "Vận dụng",
  Hard: "Nâng cao",
};

export function createQuestionsFromImportPreview(
  startIndex: number,
  count: number,
): QuestionItem[] {
  return importPreviewRows.slice(0, count).map((row, offset) => {
    const draft = {
      ...emptyQuestionDraft,
      question: row.content,
      title: row.content,
      type: typeMap[row.type] ?? "Trắc nghiệm",
      difficulty: difficultyMap[row.difficulty] ?? "Cơ bản",
      course: courseOptions[0],
      tags: row.tags.split(",").map((t) => t.trim()),
    };

    return createQuestionFromDraft(draft, startIndex + offset, "Cần duyệt");
  });
}
