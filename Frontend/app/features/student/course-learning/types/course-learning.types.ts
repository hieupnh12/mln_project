export type CourseContentType = "SLIDE_DECK" | "YOUTUBE";

export type CourseChapterItem = {
  id: number;
  subjectId: number;
  title: string;
  orderIndex: number;
};

export type CourseMaterialSummary = {
  id: number;
  lessonId: number;
  title: string;
  contentType: CourseContentType;
  slideCount: number | null;
  previewImageUrl: string | null;
};

export type CourseLessonItem = {
  id: number;
  title: string;
  chapterName: string;
  teacherName: string;
  materials: CourseMaterialSummary[];
};

export type CourseSlideItem = {
  id: number;
  index: number;
  imageUrl: string;
};

export type CourseMaterialDetail = {
  id: number;
  lessonId: number;
  title: string;
  contentType: CourseContentType;
  resourceUrl: string | null;
  slideCount: number | null;
  youtubeVideoId: string | null;
  youtubeEmbedUrl: string | null;
  slides: CourseSlideItem[];
};

export type CourseLearningSelection = {
  chapterId: number | null;
  materialId: number | null;
};
