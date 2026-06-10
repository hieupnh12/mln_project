import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import { fetchFlashcardSets } from "~/features/teacher/api/flashcard.api";

import { EXAMS_QUERY_KEYS } from "../../exams/constants/exams-api.constants";
import { getExamCatalog, getExamSession } from "../../exams/services/exams.service";
import {
  DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
  PRACTICE_QUERY_KEYS,
} from "../../practice/constants/practice.constants";
import { getPracticeQuestions } from "../../practice/services/practice.service";
import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import {
  findNextLessonAfterComplete,
  findResumeInProgressList,
} from "../../student-progress/utils/student-progress-resume.util";
import type { LearningTab } from "../../types/student.types";
import {
  useCourseChaptersQuery,
  useCourseSubjectQuery,
} from "./use-course-learning-queries";
import type { CourseMaterialSummary } from "../types/course-learning.types";

function parseSubjectId(courseId: string | undefined) {
  if (!courseId) {
    return null;
  }

  const parsed = Number(courseId);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalId(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseTabParam(value: string | null): LearningTab {
  if (value === "practice" || value === "tests") {
    return "practice";
  }
  if (value === "exams") {
    return "exams";
  }
  if (value === "flashcards" || value === "lectures") {
    return value;
  }
  return "lectures";
}

export function useStudentCoursePage() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const subjectId = useMemo(() => parseSubjectId(courseId), [courseId]);
  const hasAutoResumedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<LearningTab>(() =>
    parseTabParam(searchParams.get("tab")),
  );

  const expandedChapterId = parseOptionalId(searchParams.get("chapter"));
  const expandedLessonId = parseOptionalId(searchParams.get("lesson"));
  const selectedMaterialId = parseOptionalId(searchParams.get("material"));
  const needsCurriculum = activeTab === "lectures" || activeTab === "flashcards";

  const subjectQuery = useCourseSubjectQuery(subjectId);
  const chaptersQuery = useCourseChaptersQuery(subjectId, { enabled: needsCurriculum });
  const progressQuery = useSubjectLessonProgressQuery(subjectId);
  const subject = subjectQuery.data;
  const chapters = chaptersQuery.data ?? [];
  const resumePoint =
    subjectId != null && progressQuery.data
      ? findResumeInProgressList(subjectId, progressQuery.data)
      : null;

  useEffect(() => {
    if (subjectId == null || Number.isNaN(subjectId)) {
      return;
    }

    void queryClient.prefetchQuery({
      queryKey: ["student", "flashcard-sets"],
      queryFn: fetchFlashcardSets,
      staleTime: 5 * 60 * 1000,
    });
    queryClient.fetchQuery({
      queryKey: EXAMS_QUERY_KEYS.catalog(subjectId),
      queryFn: () => getExamCatalog(subjectId, 50),
      staleTime: 5 * 60 * 1000,
    }).then((catalog) => {
      if (catalog && Array.isArray(catalog.ongoing)) {
        catalog.ongoing.forEach((exam) => {
          void queryClient.prefetchQuery({
            queryKey: EXAMS_QUERY_KEYS.session(subjectId, exam.id),
            queryFn: () => getExamSession(subjectId, exam.id),
            staleTime: 5 * 60 * 1000,
          });
        });
      }
    }).catch(() => {});
    void queryClient.prefetchQuery({
      queryKey: PRACTICE_QUERY_KEYS.questions(
        subjectId,
        null,
        null,
        DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
      ),
      queryFn: () =>
        getPracticeQuestions(
          subjectId,
          { chapterId: null, lessonId: null },
          DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
        ),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, subjectId]);

  const flashcardSetsQuery = useQuery({
    queryKey: ["student", "flashcard-sets"],
    queryFn: fetchFlashcardSets,
    enabled: activeTab === "flashcards",
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const handleTabChange = useCallback(
    (tab: LearningTab) => {
      setActiveTab(tab);
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (tab === "lectures") {
            next.delete("tab");
          } else {
            next.set("tab", tab);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (searchParams.get("tab") === "tests") {
      setSearchParams({ tab: "practice" }, { replace: true });
      return;
    }
    setActiveTab(parseTabParam(searchParams.get("tab")));
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    hasAutoResumedRef.current = false;
  }, [subjectId]);

  useEffect(() => {
    if (
      hasAutoResumedRef.current ||
      !needsCurriculum ||
      expandedChapterId != null ||
      expandedLessonId != null ||
      !resumePoint ||
      resumePoint.lessonId <= 0 ||
      resumePoint.chapterId <= 0
    ) {
      return;
    }

    hasAutoResumedRef.current = true;
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("chapter", String(resumePoint.chapterId));
        next.set("lesson", String(resumePoint.lessonId));
        return next;
      },
      { replace: true },
    );
  }, [
    expandedChapterId,
    expandedLessonId,
    needsCurriculum,
    resumePoint,
    setSearchParams,
  ]);

  const handleToggleChapter = useCallback(
    (chapterId: number) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          const isClosing = parseOptionalId(current.get("chapter")) === chapterId;

          if (isClosing) {
            next.delete("chapter");
            next.delete("lesson");
            next.delete("material");
          } else {
            next.set("chapter", String(chapterId));
            next.delete("lesson");
            next.delete("material");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleToggleLesson = useCallback(
    (chapterId: number, lessonId: number) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("chapter", String(chapterId));
          const isClosing = parseOptionalId(current.get("lesson")) === lessonId;

          if (isClosing) {
            next.delete("lesson");
            next.delete("material");
          } else {
            next.set("lesson", String(lessonId));
            next.delete("material");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSelectMaterial = useCallback(
    (material: CourseMaterialSummary, chapterId: number) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("chapter", String(chapterId));
          next.set("lesson", String(material.lessonId));
          next.set("material", String(material.id));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleGoToNextLesson = useCallback(
    (currentLessonId: number) => {
      const nextLesson = findNextLessonAfterComplete(
        progressQuery.data ?? [],
        currentLessonId,
      );
      if (!nextLesson) {
        return;
      }

      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("chapter", String(nextLesson.chapterId));
          next.set("lesson", String(nextLesson.lessonId));
          next.delete("material");
          return next;
        },
        { replace: true },
      );
    },
    [progressQuery.data, setSearchParams],
  );

  return {
    activeTab,
    chapters,
    chaptersQuery,
    expandedChapterId,
    expandedLessonId,
    flashcardSetsQuery,
    handleGoToNextLesson,
    handleSelectMaterial,
    handleTabChange,
    handleToggleChapter,
    handleToggleLesson,
    selectedMaterialId,
    subject,
    subjectId,
    subjectQuery,
  };
}
