export type CourseTone = "mint" | "warm";

export type StudentDashboardCourse = {
  slug: string;
  title: string;
  status: string;
  progress: number;
  lessons: string;
  icon: string;
  tone: CourseTone;
};

export type StudentNavItem = {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
};

export type StudentResource = {
  title: string;
  type: string;
  icon: string;
};

export type LearningTab = "lectures" | "flashcards" | "practice" | "exams";

export type StudentChapterState = "done" | "active" | "open" | "locked";

export type StudentCourseChapter = {
  number: string;
  title: string;
  state: StudentChapterState;
};

export type StudentFlashcard = {
  front: string;
  back: string;
};

export type StudentTest = {
  title: string;
  questions: number;
  duration: string;
};




export type SubjectResponse = {
  subjectId: number;
  subjectCode: string;
  title: string;
  description: string;
};

export type SubjectListItem = {
  id: number;
  code: string;
  title: string;
  description: string;
};
