export type CourseStructureChapter = {
  id: number;
  subjectId: number;
  title: string;
  orderLabel: string;
};

export type CourseStructureMaterial = {
  id: number;
  lessonId: number;
  title: string;
  contentType: "SLIDE_DECK" | "YOUTUBE";
  slideCount: number | null;
  previewImageUrl: string | null;
};

export type CourseStructureMaterialDetail = {
  id: number;
  lessonId: number;
  title: string;
  contentType: "SLIDE_DECK" | "YOUTUBE";
  slideCount: number | null;
  youtubeEmbedUrl: string | null;
  slides: CourseStructureSlideItem[];
};

export type CourseStructureSlideItem = {
  id: number;
  index: number;
  imageUrl: string;
};

export type CourseStructureLesson = {
  id: number;
  title: string;
  teacherName: string;
  materials: CourseStructureMaterial[];
};

export type CourseStructureSubject = {
  id: number;
  code: string;
  title: string;
  description: string;
};

export type DeleteTarget =
  | { type: "chapter"; id: number; title: string }
  | { type: "lesson"; id: number; title: string; chapterId: number }
  | { type: "material"; id: number; title: string; lessonId: number };

export type MaterialFormMode = "SLIDE_DECK" | "YOUTUBE";
