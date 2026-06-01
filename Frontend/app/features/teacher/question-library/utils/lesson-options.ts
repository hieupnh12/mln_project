import { emptyQuestionDraft } from "../constants/question-library.constants";
import type { LessonOptionDto } from "../types/question-library-api.types";
import type { QuestionDraft } from "../types/question-library.types";

/** Nhãn đầy đủ: môn › chương › bài (chỉ hiển thị, DB chỉ cần lesson_id). */
export function formatLessonOptionLabel(option: LessonOptionDto): string {
  const parts = [option.subjectTitle, option.chapterTitle, option.title].filter(
    (part) => part && part.trim().length > 0,
  );
  return parts.join(" › ");
}

export function applyLessonToDraft(
  draft: QuestionDraft,
  option: LessonOptionDto,
): QuestionDraft {
  return {
    ...draft,
    lessonId: option.id,
    course: option.subjectTitle,
    chapter: option.chapterTitle,
    lesson: option.title,
  };
}

export function createQuestionDraftFromLesson(
  option: LessonOptionDto | undefined,
): QuestionDraft {
  if (!option) {
    return { ...emptyQuestionDraft };
  }
  return applyLessonToDraft(emptyQuestionDraft, option);
}

export function resolveLessonIdFromDraft(draft: QuestionDraft): number | null {
  return draft.lessonId ?? null;
}

export function getSubjectTitles(lessonOptions: LessonOptionDto[]): string[] {
  return [
    ...new Set(
      lessonOptions.map((item) => item.subjectTitle).filter((title) => title?.trim()),
    ),
  ] as string[];
}

export function getChapterTitles(
  lessonOptions: LessonOptionDto[],
  subjectTitle: string,
): string[] {
  return [
    ...new Set(
      lessonOptions
        .filter((item) => item.subjectTitle === subjectTitle)
        .map((item) => item.chapterTitle)
        .filter((title) => title?.trim()),
    ),
  ] as string[];
}

export function getLessonsForChapter(
  lessonOptions: LessonOptionDto[],
  subjectTitle: string,
  chapterTitle: string,
): LessonOptionDto[] {
  return lessonOptions.filter(
    (item) => item.subjectTitle === subjectTitle && item.chapterTitle === chapterTitle,
  );
}

export function findLessonOption(
  lessonOptions: LessonOptionDto[],
  lessonId: number | undefined,
): LessonOptionDto | undefined {
  if (lessonId == null) return undefined;
  return lessonOptions.find((item) => item.id === lessonId);
}
