
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type { LearningTab } from "../../types/student.types";
import { CourseCurriculumSidebar } from "../components/course-curriculum-sidebar";
import { CourseMaterialViewer } from "../components/course-material-viewer";
import { CoursePracticePanel } from "../components/course-practice-panel";
import { CourseSubjectHeading } from "../components/course-subject-heading";
import {
  studentCourseBottomNavItems,
  studentCourseFlashcards,
  studentCourseProfile,
  studentCourseTabs,
} from "../constants/student-course.constants";
import { useCourseSubjectQuery } from "../hooks/use-course-learning-queries";
import type { CourseMaterialSummary } from "../types/course-learning.types";

function parseSubjectId(courseId: string | undefined) {
  if (!courseId) {
    return null;
  }

  const parsed = Number(courseId);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseTabParam(value: string | null): LearningTab {
  if (value === "flashcards" || value === "tests" || value === "lectures") {
    return value;
  }
  return "lectures";
}

export function StudentCoursePage() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectId = useMemo(() => parseSubjectId(courseId), [courseId]);

  const [activeTab, setActiveTab] = useState<LearningTab>(() =>
    parseTabParam(searchParams.get("tab")),
  );

  function handleTabChange(tab: LearningTab) {
    setActiveTab(tab);
    setSearchParams(tab === "lectures" ? {} : { tab }, { replace: true });
  }

  useEffect(() => {
    setActiveTab(parseTabParam(searchParams.get("tab")));
  }, [searchParams]);
  const [expandedChapterId, setExpandedChapterId] = useState<number | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);

  const subjectQuery = useCourseSubjectQuery(subjectId);
  const subject = subjectQuery.data;

  function handleToggleChapter(chapterId: number) {
    setExpandedChapterId((current) => (current === chapterId ? null : chapterId));
    setSelectedMaterialId(null);
  }

  function handleSelectMaterial(material: CourseMaterialSummary) {
    setSelectedMaterialId(material.id);
  }

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
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop">
          <Link
            className="flex min-w-0 items-center gap-2 text-primary-container transition hover:opacity-70"
            to={STUDENT_ROUTES.dashboard}
          >
            <MaterialIcon>arrow_back</MaterialIcon>
            <span className="truncate text-label-md font-medium">Trở về Trang chủ</span>
          </Link>

          <h1 className="hidden text-headline-md font-bold text-primary md:block">
            ML Learning
          </h1>

          <div className="flex shrink-0 items-center gap-3">
            <button
              aria-label="Thông báo"
              className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50"
              type="button"
            >
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <img
              alt="Ảnh đại diện học sinh"
              className="h-8 w-8 rounded-full bg-secondary-container object-cover"
              src={studentCourseProfile.avatarUrl}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full px-margin-mobile py-md md:px-margin-desktop">
        <section className="mb-md">
          <div className="flex items-center justify-between gap-4">
            {subjectQuery.isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-56 max-w-full animate-pulse rounded-lg bg-surface-container" />
                <div className="h-7 w-16 animate-pulse rounded-md bg-surface-container-low" />
              </div>
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

            {subject && (
              <Link
                to={`/student/mindmap-preview?courseId=${subjectId}`}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-label-md font-semibold text-secondary transition-colors hover:bg-secondary/10"
              >
                <MaterialIcon>hub</MaterialIcon>
                <span>Mindmap Học Phần</span>
              </Link>
            )}
          </div>
        </section>

        <nav className="mb-md border-b border-outline-variant">
          <div className="flex gap-gutter overflow-x-auto">
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
            activeTab === "tests"
              ? "min-w-0"
              : "grid grid-cols-1 gap-gutter lg:grid-cols-12"
          }
        >
          <div
            className={
              activeTab === "tests" ? "min-w-0 space-y-md" : "min-w-0 space-y-md lg:col-span-9"
            }
          >
            {activeTab === "lectures" ? (
              <CourseMaterialViewer
                selectedMaterialId={selectedMaterialId}
                subject={subject}
              />
            ) : null}

            {activeTab === "flashcards" ? (
              <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                {studentCourseFlashcards.map((card, index) => (
                  <article
                    className="flex min-h-56 flex-col justify-between rounded-xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]"
                    key={card.front}
                  >
                    <span className="w-fit rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
                      Thẻ {index + 1}
                    </span>
                    <h3 className="mt-6 text-headline-md font-semibold text-primary">
                      {card.front}
                    </h3>
                    <p className="mt-4 text-body-md text-on-surface-variant">{card.back}</p>
                  </article>
                ))}
              </section>
            ) : null}

            {activeTab === "tests" ? (
              <CoursePracticePanel active subjectId={subjectId} />
            ) : null}
          </div>

          {activeTab === "lectures" ? (
            <div className="min-w-0 lg:col-span-3">
              <CourseCurriculumSidebar
                expandedChapterId={expandedChapterId}
                onSelectMaterial={handleSelectMaterial}
                onToggleChapter={handleToggleChapter}
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
