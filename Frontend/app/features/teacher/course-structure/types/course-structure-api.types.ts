export type SubjectDto = {
  subjectId: number;
  subjectCode: string;
  title: string;
  description: string;
};

export type CreateSubjectPayload = {
  subjectCode: string;
  title: string;
  description?: string;
};

export type UpdateSubjectPayload = {
  subjectCode: string;
  title: string;
  description?: string;
};

export type ChapterDto = {
  chapterId: number;
  subjectId: number;
  title: string;
};

export type MaterialSummaryDto = {
  MaterialId?: number;
  materialId?: number;
  lessonId: number;
  title: string;
  contentType: string;
  resourceUrl?: string | null;
  slideCount?: number | null;
  previewImageUrl?: string | null;
};

export type MaterialDetailDto = {
  materialId: number;
  lessonId: number;
  title: string;
  contentType: string;
  resourceUrl?: string | null;
  slideCount?: number | null;
  youtubeVideoId?: string | null;
  youtubeEmbedUrl?: string | null;
  slides?: SlideDto[];
};

export type SlideDto = {
  slideId: number;
  slideIndex: number;
  imageUrl: string;
};

export type LessonWithMaterialsDto = {
  LessonId?: number;
  lessonId?: number;
  chapterName: string;
  teacherName: string;
  title: string;
  materials: MaterialSummaryDto[];
};

export type CreateChapterPayload = {
  title: string;
  subjectId?: number;
};

export type UpdateChapterPayload = {
  title: string;
};

export type CreateLessonPayload = {
  title: string;
};

export type UpdateLessonPayload = {
  title?: string;
  content?: string | null;
};

export type LessonDetailDto = {
  lessonId: number;
  chapterName: string;
  teacherName: string;
  title: string;
  content: string | null;
};

export type CreateMaterialPayload = {
  title: string;
  youtubeUrl?: string;
  files?: File[];
};
