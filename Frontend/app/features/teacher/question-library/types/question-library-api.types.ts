export type BackendApiResponse<T> = {
  code: number;
  message?: string;
  result: T;
};

export type LessonOptionDto = {
  id: number;
  title: string;
  chapterId: number | null;
  chapterTitle: string;
  subjectId: number | null;
  subjectTitle: string;
};

export type QuestionMetadataDto = {
  courses: string[];
  chapters: string[];
  lessons: string[];
  lessonOptions: LessonOptionDto[];
};

export type QuestionDto = {
  id: string;
  lessonId: number | null;
  title: string;
  question: string;
  type: string;
  difficulty: string;
  status: string;
  course: string;
  chapter: string;
  lesson: string;
  answer: string;
  explanation?: string;
  score: number;
  estimatedTime: number;
  tags: string[];
  options: string[];
  updatedBy: string;
  duplicateWarning?: string | null;
};

export type DuplicateCheckDto = {
  exactDuplicate: boolean;
  similarDuplicate: boolean;
  warningMessage?: string | null;
  matchedQuestion?: QuestionDto | null;
};

export type CheckDuplicatePayload = {
  lessonId: number;
  type: string;
  content: string;
  excludeQuestionId?: number;
};

export type QuestionListDto = {
  items: QuestionDto[];
  total: number;
  page: number;
  size: number;
};

export type QuestionStatsDto = {
  totalQuestions: number;
  totalCourses: number;
  byDifficulty: Record<string, number>;
  byStatus: Record<string, number>;
};

export type CreateQuestionPayload = {
  lessonId: number;
  title: string;
  question: string;
  type: string;
  difficulty: string;
  status: string;
  bloomLevel?: string;
  explanation?: string;
  answer?: string;
  score?: number;
  estimatedTime?: number;
  tags?: string[];
  options?: { content: string; isCorrect?: boolean }[];
  correctOptionIndex?: number;
  allowSimilarSave?: boolean;
};

export type BatchImportRowPayload = {
  rowId: string;
  content: string;
  type: string;
  difficulty: string;
  tags?: string;
  lessonId?: number;
  subjectTitle?: string;
  chapterTitle?: string;
  lessonTitle?: string;
  options?: { content: string; isCorrect?: boolean }[];
  answer?: string;
  explanation?: string;
};

export type BatchImportPayload = {
  lessonId: number;
  defaultStatus?: string;
  rows: BatchImportRowPayload[];
};

export type BatchImportReportDto = {
  totalRows: number;
  savedCount: number;
  skippedExactDuplicate: number;
  markedSimilar: number;
  failedValidation: number;
  rows: {
    rowId: string;
    status: string;
    message?: string;
    questionId?: string;
  }[];
};
