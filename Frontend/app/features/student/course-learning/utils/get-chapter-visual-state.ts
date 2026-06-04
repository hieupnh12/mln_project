import type { StudentChapterState } from "../../types/student.types";
import type { CourseChapterItem } from "../types/course-learning.types";

export function getChapterVisualState(
  chapter: CourseChapterItem,
  expandedChapterId: number | null,
  chapters: CourseChapterItem[],
): StudentChapterState {
  if (expandedChapterId === chapter.id) {
    return "active";
  }

  const expandedChapter = chapters.find((item) => item.id === expandedChapterId);

  if (!expandedChapter) {
    return "open";
  }

  if (chapter.orderIndex < expandedChapter.orderIndex) {
    return "done";
  }

  if (chapter.orderIndex === expandedChapter.orderIndex + 1) {
    return "open";
  }

  return "locked";
}

export function computeCourseProgress(
  expandedChapterId: number | null,
  chapters: CourseChapterItem[],
): number {
  if (chapters.length === 0) {
    return 0;
  }

  const expandedChapter = chapters.find((chapter) => chapter.id === expandedChapterId);

  if (!expandedChapter) {
    return Math.round(100 / chapters.length / 2);
  }

  const activePosition = expandedChapter.orderIndex - 0.5;
  return Math.round((activePosition / chapters.length) * 100);
}
