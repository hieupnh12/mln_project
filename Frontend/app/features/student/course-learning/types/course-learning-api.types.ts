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

export type LessonWithMaterialsDto = {
  LessonId?: number;
  lessonId?: number;
  chapterName: string;
  teacherName: string;
  title: string;
  materials: MaterialSummaryDto[];
};

export type SlideDto = {
  slideId: number;
  slideIndex: number;
  imageUrl: string;
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
