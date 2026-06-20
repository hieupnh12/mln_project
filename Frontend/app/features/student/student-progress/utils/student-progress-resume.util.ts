import type { SubjectListItem } from "../../types/student.types";
import type {
  StudentLessonProgress,
  StudentResumePoint,
} from "../types/student-progress.types";

export function computeProgressPercent(items: StudentLessonProgress[]): number {
  if (items.length === 0) {
    return 0;
  }

  const completedCount = items.filter((item) => item.status === "COMPLETED").length;
  return Math.round((completedCount / items.length) * 100);
}

export function findResumeInProgressList(
  subjectId: number,
  items: StudentLessonProgress[],
): StudentResumePoint | null {
  if (items.length === 0) {
    return null;
  }

  const inProgress = items.find((item) => item.status === "IN_PROGRESS");
  if (inProgress) {
    return {
      subjectId,
      chapterId: inProgress.chapterId,
      lessonId: inProgress.lessonId,
      materialId: null,
    };
  }

  const notStarted = items.find((item) => item.status === "NOT_STARTED");
  if (notStarted) {
    return {
      subjectId,
      chapterId: notStarted.chapterId,
      lessonId: notStarted.lessonId,
      materialId: null,
    };
  }

  return null;
}

export function findGlobalResumePoint(
  subjects: SubjectListItem[],
  progressBySubject: Map<number, StudentLessonProgress[]>,
): StudentResumePoint | null {
  for (const subject of subjects) {
    const items = progressBySubject.get(subject.id) ?? [];
    const resume = findResumeInProgressList(subject.id, items);
    if (resume) {
      return resume;
    }
  }

  const firstSubject = subjects[0];
  if (!firstSubject) {
    return null;
  }

  const firstItems = progressBySubject.get(firstSubject.id) ?? [];
  const firstLesson = firstItems[0];
  if (firstLesson) {
    return {
      subjectId: firstSubject.id,
      chapterId: firstLesson.chapterId,
      lessonId: firstLesson.lessonId,
      materialId: null,
    };
  }

  return {
    subjectId: firstSubject.id,
    chapterId: 0,
    lessonId: 0,
    materialId: null,
  };
}

export function buildLessonProgressMap(
  items: StudentLessonProgress[],
): Map<number, StudentLessonProgress> {
  return new Map(items.map((item) => [item.lessonId, item]));
}

export function findNextLessonAfterComplete(
  items: StudentLessonProgress[],
  completedLessonId: number,
): StudentLessonProgress | null {
  const completedIndex = items.findIndex((item) => item.lessonId === completedLessonId);
  if (completedIndex === -1) {
    return items.find((item) => item.status !== "COMPLETED") ?? null;
  }

  return (
    items.slice(completedIndex + 1).find((item) => item.status !== "COMPLETED") ?? null
  );
}

export function findAdjacentLessons(
  items: StudentLessonProgress[],
  currentLessonId: number,
): {
  previous: StudentLessonProgress | null;
  next: StudentLessonProgress | null;
} {
  const currentIndex = items.findIndex((item) => item.lessonId === currentLessonId);
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? (items[currentIndex - 1] ?? null) : null,
    next:
      currentIndex < items.length - 1 ? (items[currentIndex + 1] ?? null) : null,
  };
}
