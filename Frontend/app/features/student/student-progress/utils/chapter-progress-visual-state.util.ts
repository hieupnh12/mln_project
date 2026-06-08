import type { StudentChapterState } from "../../types/student.types";
import type { CourseChapterItem } from "../../course-learning/types/course-learning.types";
import type { StudentLessonProgress } from "../types/student-progress.types";

export function getChapterVisualStateFromProgress(
  chapter: CourseChapterItem,
  subjectProgress: StudentLessonProgress[],
  chapters: CourseChapterItem[],
): StudentChapterState {
  const chapterLessons = subjectProgress.filter((item) => item.chapterId === chapter.id);

  if (chapterLessons.length === 0) {
    return "open";
  }

  if (chapterLessons.every((item) => item.status === "COMPLETED")) {
    return "done";
  }

  if (chapterLessons.some((item) => item.status === "IN_PROGRESS")) {
    return "active";
  }

  const hasPartialCompletion = chapterLessons.some((item) => item.status === "COMPLETED");
  if (hasPartialCompletion) {
    return "active";
  }

  const previousChapters = chapters.filter((item) => item.orderIndex < chapter.orderIndex);
  const allPreviousCompleted = previousChapters.every((prevChapter) => {
    const prevLessons = subjectProgress.filter((item) => item.chapterId === prevChapter.id);
    return prevLessons.length > 0 && prevLessons.every((item) => item.status === "COMPLETED");
  });

  if (previousChapters.length > 0 && !allPreviousCompleted) {
    return "open";
  }

  return "open";
}

export function computeCourseProgressFromLessons(items: StudentLessonProgress[]): number {
  if (items.length === 0) {
    return 0;
  }

  const completedCount = items.filter((item) => item.status === "COMPLETED").length;
  return Math.round((completedCount / items.length) * 100);
}
