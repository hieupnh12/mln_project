import type { LessonOptionDto } from "../types/question-library-api.types";
import { formatLessonOptionLabel } from "./lesson-options";
import {
  isImportTextCompatible,
  isImportTextEqual,
} from "./normalize-import-text";

export type ParsedImportFileRow = {
  content: string;
  type: string;
  difficulty: string;
  tags: string;
  subject: string;
  chapter: string;
  lesson: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
};

export type ResolvedImportLesson = {
  lessonId: number | null;
  lessonLabel: string;
  lessonError?: string;
};

function filterBySubject(options: LessonOptionDto[], subject: string) {
  if (!subject.trim()) {
    return options;
  }
  const filtered = options.filter((option) =>
    isImportTextEqual(option.subjectTitle, subject),
  );
  return filtered.length > 0 ? filtered : options;
}

function filterByChapter(options: LessonOptionDto[], chapter: string) {
  if (!chapter.trim()) {
    return options;
  }
  return options.filter((option) =>
    isImportTextCompatible(option.chapterTitle, chapter),
  );
}

function filterByLessonTitle(options: LessonOptionDto[], lesson: string) {
  if (!lesson.trim()) {
    return options;
  }

  const exact = options.filter((option) => isImportTextEqual(option.title, lesson));
  if (exact.length === 1) {
    return exact;
  }
  if (exact.length > 1) {
    return exact;
  }

  return options.filter((option) => isImportTextCompatible(option.title, lesson));
}

function pickUnique(options: LessonOptionDto[]) {
  return options.length === 1 ? options[0] : undefined;
}

export function findImportLessonMatch(
  lessonOptions: LessonOptionDto[],
  subject: string,
  chapter: string,
  lesson: string,
): LessonOptionDto | undefined {
  if (lessonOptions.length === 0) {
    return undefined;
  }

  const hasExplicit =
    subject.trim().length > 0 || chapter.trim().length > 0 || lesson.trim().length > 0;

  if (!hasExplicit) {
    return undefined;
  }

  const exactTriple = lessonOptions.find(
    (option) =>
      isImportTextEqual(option.subjectTitle, subject) &&
      isImportTextEqual(option.chapterTitle, chapter) &&
      isImportTextEqual(option.title, lesson),
  );
  if (exactTriple) {
    return exactTriple;
  }

  if (subject.trim() && lesson.trim()) {
    const bySubjectLesson = lessonOptions.filter(
      (option) =>
        isImportTextEqual(option.subjectTitle, subject) &&
        isImportTextEqual(option.title, lesson),
    );
    const unique = pickUnique(bySubjectLesson);
    if (unique) {
      return unique;
    }
  }

  let candidates = filterBySubject(lessonOptions, subject);
  candidates = filterByChapter(candidates, chapter);
  candidates = filterByLessonTitle(candidates, lesson);
  const fuzzyUnique = pickUnique(candidates);
  if (fuzzyUnique) {
    return fuzzyUnique;
  }

  if (subject.trim() && lesson.trim()) {
    const partialLesson = filterBySubject(lessonOptions, subject).filter((option) =>
      isImportTextCompatible(option.title, lesson),
    );
    const unique = pickUnique(partialLesson);
    if (unique) {
      return unique;
    }
  }

  if (lesson.trim()) {
    const globalLesson = filterByLessonTitle(lessonOptions, lesson);
    const unique = pickUnique(globalLesson);
    if (unique) {
      return unique;
    }
  }

  return undefined;
}

export function resolveImportLessonForRow(
  row: Pick<ParsedImportFileRow, "subject" | "chapter" | "lesson">,
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number | null,
): ResolvedImportLesson {
  const hasExplicit =
    row.subject.trim().length > 0 ||
    row.chapter.trim().length > 0 ||
    row.lesson.trim().length > 0;

  if (hasExplicit) {
    const matched = findImportLessonMatch(
      lessonOptions,
      row.subject,
      row.chapter,
      row.lesson,
    );

    if (matched) {
      return {
        lessonId: matched.id,
        lessonLabel: formatLessonOptionLabel(matched),
      };
    }

    const parts = [row.subject, row.chapter, row.lesson].filter((part) => part.trim());
    return {
      lessonId: null,
      lessonLabel: parts.join(" › "),
      lessonError:
        "Không khớp môn/chương/bài trong hệ thống. Dùng đúng tên như khi tạo câu hỏi thủ công.",
    };
  }

  if (defaultLessonId == null) {
    return {
      lessonId: null,
      lessonLabel: "Chưa chọn bài học mặc định",
      lessonError: "Cần chọn bài học mặc định hoặc điền Môn/Chương/Bài trong file",
    };
  }

  const defaultOption = lessonOptions.find((option) => option.id === defaultLessonId);
  if (!defaultOption) {
    return {
      lessonId: null,
      lessonLabel: "Bài học mặc định không hợp lệ",
      lessonError: "Bài học mặc định không tồn tại",
    };
  }

  return {
    lessonId: defaultOption.id,
    lessonLabel: formatLessonOptionLabel(defaultOption),
  };
}

export function countImportLessonIssues(
  rows: { lessonId?: number | null; lessonError?: string }[],
) {
  return rows.filter((row) => !row.lessonId || row.lessonError).length;
}

export function buildImportTemplateSamples(lessonOptions: LessonOptionDto[]) {
  if (lessonOptions.length === 0) {
    return [];
  }

  const first = lessonOptions[0];
  const second = lessonOptions[1] ?? lessonOptions[0];

  return [
    {
      subject: first.subjectTitle,
      chapter: first.chapterTitle,
      lesson: first.title,
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
      subject: second.subjectTitle,
      chapter: second.chapterTitle,
      lesson: second.title,
      content: "Vai trò của lực lượng sản xuất trong phát triển xã hội?",
      type: "Tự luận",
      difficulty: "Vận dụng",
      tags: "Kinh tế chính trị",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
      explanation: "Phân tích vai trò quyết định của sản xuất vật chất.",
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
}

export function listImportLessonHints(lessonOptions: LessonOptionDto[], limit = 6) {
  return lessonOptions.slice(0, limit).map((option) => formatLessonOptionLabel(option));
}
