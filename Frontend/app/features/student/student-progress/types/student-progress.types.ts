export type StudentProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type StudentLessonProgressDto = {
  studentId: number;
  lessonId: number;
  chapterId: number;
  lessonTitle: string;
  status: StudentProgressStatus;
};

export type StudentLessonProgress = {
  studentId: number;
  lessonId: number;
  chapterId: number;
  lessonTitle: string;
  status: StudentProgressStatus;
};

export type UpdateLessonProgressPayload = {
  status: StudentProgressStatus;
};

export type StudentResumePoint = {
  subjectId: number;
  chapterId: number;
  lessonId: number;
  materialId: number | null;
};
