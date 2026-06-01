import type { LessonOptionDto } from "../types/question-library-api.types";
import type { RandomExamScope } from "../types/export-exam.types";
import type { Difficulty, QuestionItem } from "../types/question-library.types";

export type QuestionScopeSummary = Pick<
  QuestionItem,
  "id" | "difficulty" | "chapter" | "lesson" | "course"
> & {
  lessonId?: number;
};

export function getChaptersForScope(
  lessonOptions: LessonOptionDto[],
  subjectTitle: string,
): string[] {
  return [
    ...new Set(
      lessonOptions
        .filter((item) => item.subjectTitle === subjectTitle)
        .map((item) => item.chapterTitle)
        .filter(Boolean),
    ),
  ];
}

export function getLessonsForScope(
  lessonOptions: LessonOptionDto[],
  subjectTitle: string,
  chapterTitles: string[],
): LessonOptionDto[] {
  return lessonOptions.filter((item) => {
    if (item.subjectTitle !== subjectTitle) {
      return false;
    }
    if (chapterTitles.length === 0) {
      return true;
    }
    return chapterTitles.includes(item.chapterTitle);
  });
}

export function filterQuestionsByScope<T extends QuestionScopeSummary>(
  questions: T[],
  scope: RandomExamScope,
  lessonOptions: LessonOptionDto[],
): T[] {
  if (!scope.subjectTitle) {
    return questions;
  }

  const allowedLessons = getLessonsForScope(
    lessonOptions,
    scope.subjectTitle,
    scope.chapterTitles,
  );
  const allowedLessonTitles = new Set(allowedLessons.map((item) => item.title));
  const allowedLessonIds = new Set(allowedLessons.map((item) => item.id));

  return questions.filter((question) => {
    if (question.course !== scope.subjectTitle) {
      return false;
    }

    if (scope.chapterTitles.length > 0 && !scope.chapterTitles.includes(question.chapter)) {
      return false;
    }

    if (scope.lessonIds.length > 0) {
      if (question.lessonId != null) {
        return scope.lessonIds.includes(question.lessonId);
      }
      const matchedLesson = allowedLessons.find(
        (item) => item.title === question.lesson && item.chapterTitle === question.chapter,
      );
      return matchedLesson ? scope.lessonIds.includes(matchedLesson.id) : false;
    }

    return allowedLessonTitles.has(question.lesson);
  });
}

export function countByDifficulty<T extends Pick<QuestionItem, "difficulty">>(
  questions: T[],
): Record<Difficulty, number> {
  return questions.reduce<Record<Difficulty, number>>(
    (acc, question) => {
      acc[question.difficulty] += 1;
      return acc;
    },
    { "Cơ bản": 0, "Vận dụng": 0, "Nâng cao": 0 },
  );
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function pickRandomQuestions<T extends QuestionScopeSummary>(
  candidates: T[],
  totalCount: number,
  easyPercent: number,
  mediumPercent: number,
): T[] {
  const easyTarget = Math.round((totalCount * easyPercent) / 100);
  const mediumTarget = Math.round((totalCount * mediumPercent) / 100);
  const hardTarget = Math.max(0, totalCount - easyTarget - mediumTarget);

  const pools: Record<Difficulty, T[]> = {
    "Cơ bản": shuffle(candidates.filter((item) => item.difficulty === "Cơ bản")),
    "Vận dụng": shuffle(candidates.filter((item) => item.difficulty === "Vận dụng")),
    "Nâng cao": shuffle(candidates.filter((item) => item.difficulty === "Nâng cao")),
  };

  const picked: T[] = [];
  const targets: Record<Difficulty, number> = {
    "Cơ bản": easyTarget,
    "Vận dụng": mediumTarget,
    "Nâng cao": hardTarget,
  };

  (Object.keys(targets) as Difficulty[]).forEach((difficulty) => {
    picked.push(...pools[difficulty].slice(0, targets[difficulty]));
  });

  if (picked.length < totalCount) {
    const pickedIds = new Set(picked.map((item) => item.id));
    const remainder = shuffle(candidates.filter((item) => !pickedIds.has(item.id)));
    picked.push(...remainder.slice(0, totalCount - picked.length));
  }

  return shuffle(picked).slice(0, totalCount);
}
