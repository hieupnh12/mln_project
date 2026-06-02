import type { LessonOptionDto } from "../types/question-library-api.types";
import type { RandomExamScope } from "../types/export-exam.types";
import { getChaptersForScope, getLessonsForScope } from "./random-exam";

export type ChapterScopeGroup = {
  chapterTitle: string;
  lessons: LessonOptionDto[];
};

export function groupLessonsByChapter(
  lessonOptions: LessonOptionDto[],
  subjectTitle: string,
): ChapterScopeGroup[] {
  const chapters = getChaptersForScope(lessonOptions, subjectTitle);
  return chapters.map((chapterTitle) => ({
    chapterTitle,
    lessons: lessonOptions.filter(
      (item) => item.subjectTitle === subjectTitle && item.chapterTitle === chapterTitle,
    ),
  }));
}

function getLessonIdsInChapter(group: ChapterScopeGroup): number[] {
  return group.lessons.map((lesson) => lesson.id);
}

export function isChapterFullySelected(scope: RandomExamScope, group: ChapterScopeGroup): boolean {
  return scope.chapterTitles.includes(group.chapterTitle);
}

export function getSelectedLessonIdsInChapter(
  scope: RandomExamScope,
  group: ChapterScopeGroup,
): number[] {
  if (isChapterFullySelected(scope, group)) {
    return getLessonIdsInChapter(group);
  }
  const chapterLessonIds = new Set(getLessonIdsInChapter(group));
  return scope.lessonIds.filter((id) => chapterLessonIds.has(id));
}

export function isChapterPartiallySelected(scope: RandomExamScope, group: ChapterScopeGroup): boolean {
  const selectedCount = getSelectedLessonIdsInChapter(scope, group).length;
  return selectedCount > 0 && !isChapterFullySelected(scope, group);
}

export function isLessonSelected(scope: RandomExamScope, lesson: LessonOptionDto): boolean {
  if (isChapterFullySelected(scope, { chapterTitle: lesson.chapterTitle, lessons: [lesson] })) {
    return true;
  }
  return scope.lessonIds.includes(lesson.id);
}

export function isEntireSubjectSelected(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): boolean {
  return scope.chapterTitles.length === 0 && scope.lessonIds.length === 0;
}

export function countSelectedLessons(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): number {
  const groups = groupLessonsByChapter(lessonOptions, scope.subjectTitle);
  if (isEntireSubjectSelected(scope, lessonOptions)) {
    return groups.reduce((total, group) => total + group.lessons.length, 0);
  }

  return groups.reduce(
    (total, group) => total + getSelectedLessonIdsInChapter(scope, group).length,
    0,
  );
}

export function buildScopeSummary(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): string {
  const groups = groupLessonsByChapter(lessonOptions, scope.subjectTitle);
  const totalLessons = groups.reduce((total, group) => total + group.lessons.length, 0);

  if (isEntireSubjectSelected(scope, lessonOptions)) {
    return `Toàn bộ môn (${totalLessons} bài)`;
  }

  const parts = groups
    .map((group) => {
      if (isChapterFullySelected(scope, group)) {
        return `${shortenChapterLabel(group.chapterTitle)} (tất cả)`;
      }
      const selected = getSelectedLessonIdsInChapter(scope, group);
      if (selected.length === 0) {
        return null;
      }
      return `${shortenChapterLabel(group.chapterTitle)} (${selected.length} bài)`;
    })
    .filter(Boolean);

  if (parts.length === 0) {
    return "Chưa chọn phạm vi";
  }

  return parts.join(" · ");
}

function shortenChapterLabel(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length <= 28) {
    return trimmed;
  }
  return `${trimmed.slice(0, 25)}…`;
}

export function selectEntireSubject(scope: RandomExamScope): RandomExamScope {
  return {
    ...scope,
    chapterTitles: [],
    lessonIds: [],
  };
}

export function clearSubjectScope(scope: RandomExamScope): RandomExamScope {
  return {
    ...scope,
    chapterTitles: [],
    lessonIds: [],
  };
}

export function selectAllChapters(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): RandomExamScope {
  const groups = groupLessonsByChapter(lessonOptions, scope.subjectTitle);
  return {
    ...scope,
    chapterTitles: groups.map((group) => group.chapterTitle),
    lessonIds: [],
  };
}

export function toggleChapterScope(
  scope: RandomExamScope,
  group: ChapterScopeGroup,
): RandomExamScope {
  const chapterLessonIds = new Set(getLessonIdsInChapter(group));

  if (isChapterFullySelected(scope, group)) {
    return {
      ...scope,
      chapterTitles: scope.chapterTitles.filter((title) => title !== group.chapterTitle),
    };
  }

  return {
    ...scope,
    chapterTitles: [...scope.chapterTitles, group.chapterTitle],
    lessonIds: scope.lessonIds.filter((id) => !chapterLessonIds.has(id)),
  };
}

export function toggleLessonScope(
  scope: RandomExamScope,
  lesson: LessonOptionDto,
  groups: ChapterScopeGroup[],
): RandomExamScope {
  const group = groups.find((item) => item.chapterTitle === lesson.chapterTitle);
  if (!group) {
    return scope;
  }

  const chapterLessonIds = getLessonIdsInChapter(group);
  const currentlySelected = isLessonSelected(scope, lesson);

  if (isChapterFullySelected(scope, group)) {
    const remainingLessonIds = chapterLessonIds.filter((id) => id !== lesson.id);
    return {
      ...scope,
      chapterTitles: scope.chapterTitles.filter((title) => title !== group.chapterTitle),
      lessonIds: [...scope.lessonIds.filter((id) => !chapterLessonIds.includes(id)), ...remainingLessonIds],
    };
  }

  if (currentlySelected) {
    const nextLessonIds = scope.lessonIds.filter((id) => id !== lesson.id);
    return { ...scope, lessonIds: nextLessonIds };
  }

  const nextLessonIds = [...scope.lessonIds, lesson.id];
  const allSelected = chapterLessonIds.every((id) => nextLessonIds.includes(id));
  if (allSelected) {
    return {
      ...scope,
      chapterTitles: [...scope.chapterTitles, group.chapterTitle],
      lessonIds: nextLessonIds.filter((id) => !chapterLessonIds.includes(id)),
    };
  }

  return { ...scope, lessonIds: nextLessonIds };
}

export function getVisibleLessonGroups(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): ChapterScopeGroup[] {
  return groupLessonsByChapter(lessonOptions, scope.subjectTitle);
}

export function getLessonsInScopeCount(
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): number {
  return getLessonsForScope(lessonOptions, scope.subjectTitle, scope.chapterTitles).length;
}
