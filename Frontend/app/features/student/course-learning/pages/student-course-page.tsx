import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchFlashcardSets } from "~/features/teacher/api/flashcard.api";
import { EXAMS_QUERY_KEYS } from "../../exams/constants/exams-api.constants";
import { getExamCatalog } from "../../exams/services/exams.service";
import {
  PRACTICE_QUERY_KEYS,
  DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
} from "../../practice/constants/practice.constants";
import { getPracticeQuestions } from "../../practice/services/practice.service";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type { LearningTab } from "../../types/student.types";
import { CourseCurriculumSidebar } from "../components/course-curriculum-sidebar";
import { CourseLearningHeader } from "../components/course-learning-header";
import { CourseMaterialViewer } from "../components/course-material-viewer";
import { CoursePracticePanel } from "../components/course-practice-panel";
import { CourseExamCatalogPanel } from "../../exams/components/course-exam-catalog-panel";
import {
  studentCourseBottomNavItems,
  studentCourseFlashcards,
  studentCourseTabs,
} from "../constants/student-course.constants";
import { useCourseChaptersQuery, useCourseSubjectQuery } from "../hooks/use-course-learning-queries";
import type { CourseMaterialSummary } from "../types/course-learning.types";
import { CourseSubjectHeading } from "../components/course-subject-heading";
import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import {
  findNextLessonAfterComplete,
  findResumeInProgressList,
} from "../../student-progress/utils/student-progress-resume.util";

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

export function StudentCoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (subjectId != null && !Number.isNaN(subjectId)) {
      // 1. Prefetch flashcard sets
      queryClient.prefetchQuery({
        queryKey: ["student", "flashcard-sets"],
        queryFn: fetchFlashcardSets,
        staleTime: 5 * 60 * 1000,
      });

      // 2. Prefetch student exams catalog
      queryClient.prefetchQuery({
        queryKey: EXAMS_QUERY_KEYS.catalog(subjectId),
        queryFn: () => getExamCatalog(subjectId, 50),
        staleTime: 5 * 60 * 1000,
      });

      // 3. Prefetch default practice questions (scope: null, null)
      queryClient.prefetchQuery({
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
    }
  }, [subjectId, queryClient]);

  const { data: flashcardSets, isLoading: isFlashcardSetsLoading } = useQuery({
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
      expandedLessonId != null
    ) {
      return;
    }

    if (!resumePoint || resumePoint.lessonId <= 0 || resumePoint.chapterId <= 0) {
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

  if (subjectId == null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-gutter">
        <div className="max-w-md rounded-xl border border-error/30 bg-error-container/30 p-gutter text-center">
          <p className="text-body-md font-medium text-error">Khóa học không hợp lệ.</p>
          <Link
            className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary"
            to={STUDENT_ROUTES.dashboard}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background pb-24 font-body-md text-on-surface md:pb-0">
      <CourseLearningHeader />

      <main className="mx-auto w-full px-margin-mobile py-md md:px-margin-desktop">
        <section className="mb-md">
          <div>
            {subjectQuery.isLoading ? (
              <div className="h-8 w-56 max-w-full animate-pulse rounded-lg bg-surface-container" />
            ) : subjectQuery.isError ? (
              <div>
                <h2 className="text-headline-md font-semibold text-primary">
                  Không tải được thông tin môn học
                </h2>
                <button
                  className="mt-2 text-label-md font-medium text-secondary underline"
                  onClick={() => subjectQuery.refetch()}
                  type="button"
                >
                  Thử lại
                </button>
              </div>
            ) : subject ? (
              <CourseSubjectHeading code={subject.code} title={subject.title} />
            ) : null}
          </div>
        </section>

        <nav className="mb-md border-b border-outline-variant">
          <div className="flex gap-gutter overflow-x-auto scroll-hide">
            {studentCourseTabs.map((tab) => (
              <button
                className={
                  activeTab === tab.id
                    ? "whitespace-nowrap border-b-2 border-secondary px-1 pb-3 text-label-md font-medium text-primary"
                    : "whitespace-nowrap px-1 pb-3 text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
                }
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div
          className={
            activeTab === "practice" || activeTab === "exams"
              ? "min-w-0"
              : "grid grid-cols-1 gap-gutter lg:grid-cols-12 lg:items-start"
          }
        >
          <div
            className={
              activeTab === "practice" || activeTab === "exams"
                ? "min-w-0 space-y-md"
                : "min-w-0 space-y-md lg:col-span-8"
            }
          >
            {activeTab === "lectures" ? (
              <CourseMaterialViewer
                expandedChapterId={expandedChapterId}
                onGoToNextLesson={handleGoToNextLesson}
                selectedMaterialId={selectedMaterialId}
                subject={subject}
                subjectId={subjectId}
              />
            ) : null}

            {activeTab === "flashcards" ? (
              chaptersQuery.isLoading || isFlashcardSetsLoading ? (
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="h-44 animate-pulse rounded-xl bg-surface-container" key={index} />
                  ))}
                </div>
              ) : chapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] bg-white border border-outline-variant/60 rounded-xl p-md text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
                  <MaterialIcon className="text-secondary text-5xl mb-3 opacity-60">style</MaterialIcon>
                  <h3 className="text-headline-md font-semibold text-primary">Chưa có thẻ ghi nhớ</h3>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    Môn học này hiện chưa có chương học nào để hiển thị thẻ ghi nhớ.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((chapter) => {
                    const matchedSet = flashcardSets?.find((set) => set.id === chapter.id);
                    const cardsCount = matchedSet?.cards ?? 0;

                    return (
                      <article
                        className="flex flex-col justify-between rounded-xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:shadow-[0_8px_30px_rgba(35,39,51,0.08)]"
                        key={chapter.id}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="w-fit rounded-full bg-secondary-container/40 px-3 py-1 text-label-sm font-bold text-secondary">
                              Chương {chapter.orderIndex}
                            </span>
                            <span className="text-body-sm font-semibold text-on-surface-variant flex items-center gap-1">
                              <MaterialIcon className="text-lg">style</MaterialIcon>
                              {cardsCount} thẻ
                            </span>
                          </div>
                          <h3 className="mt-4 text-headline-md font-semibold text-primary line-clamp-2 min-h-14">
                            {chapter.title}
                          </h3>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant/40 pt-4">
                          <span className="text-body-sm text-on-surface-variant">
                            {cardsCount > 0 ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Đã sẵn sàng
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-on-surface-variant/60 italic">
                                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                Trống
                              </span>
                            )}
                          </span>
                          
                          <button
                            onClick={() => {
                              if (cardsCount > 0) {
                                navigate(`/student/chapters/${chapter.id}/flashcards`);
                              }
                            }}
                            disabled={cardsCount === 0}
                            className={`rounded-lg px-4 py-2 text-label-md font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                              cardsCount > 0
                                ? "bg-primary text-white hover:bg-primary-container/90 cursor-pointer"
                                : "bg-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed"
                            }`}
                            type="button"
                          >
                            <span>Học ngay</span>
                            <MaterialIcon className="text-lg font-bold">arrow_forward</MaterialIcon>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : null}

            {activeTab === "practice" ? (
              <CoursePracticePanel active subjectId={subjectId} />
            ) : null}

            {activeTab === "exams" ? (
              <CourseExamCatalogPanel
                active
                courseTitle={subject?.title}
                subjectId={subjectId}
              />
            ) : null}
          </div>

          {activeTab === "lectures" ? (
            <div className="min-w-0 lg:sticky lg:top-24 lg:col-span-4 lg:h-[calc(100vh-7rem)] lg:self-start">
              <CourseCurriculumSidebar
                expandedChapterId={expandedChapterId}
                expandedLessonId={expandedLessonId}
                onSelectMaterial={handleSelectMaterial}
                onToggleChapter={handleToggleChapter}
                onToggleLesson={handleToggleLesson}
                selectedMaterialId={selectedMaterialId}
                subjectId={subjectId}
              />
            </div>
          ) : null}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant/10 bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_20px_rgba(35,39,51,0.04)] md:hidden">
        {studentCourseBottomNavItems.map((item) => (
          <Link
            className={
              item.active
                ? "flex flex-col items-center justify-center rounded-full bg-secondary-container px-4 py-1 text-on-secondary-container"
                : "flex flex-col items-center justify-center text-on-surface-variant"
            }
            key={item.label}
            to={item.href}
          >
            <MaterialIcon filled={item.active}>{item.icon}</MaterialIcon>
            <span className="text-label-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
