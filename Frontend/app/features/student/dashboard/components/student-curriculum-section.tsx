import { ArrowRight, BookOpen, RefreshCw, Route } from "lucide-react";
import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCoursePath,
  getStudentCourseResumePath,
} from "../../constants/student-routes.constants";
import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import {
  computeProgressPercent,
  findResumeInProgressList,
} from "../../student-progress/utils/student-progress-resume.util";
import type { SubjectListItem } from "../../types/student.types";
import { courseToneClass } from "../constants/student-dashboard.constants";
import { useSubjects } from "../hooks/dashboard.hooks";
import { mapSubjectToCourseCard } from "../utils/map-subject-to-course-card";
import { StudentDashboardSectionHeader } from "./student-dashboard-section-header";

function CurriculumSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="min-h-64 animate-pulse rounded-xl border border-outline-variant/35 bg-landing-white p-gutter"
          key={index}
        >
          <div className="mb-5 h-10 w-10 rounded-xl bg-landing-gray" />
          <div className="mb-3 h-6 w-3/4 rounded-lg bg-landing-gray" />
          <div className="h-4 w-full rounded-lg bg-landing-gray" />
          <div className="mt-12 h-1.5 w-full rounded-full bg-landing-gray" />
        </div>
      ))}
    </>
  );
}

type SubjectCourseCardProps = {
  index: number;
  subject: SubjectListItem;
};

function SubjectCourseCard({ subject, index }: SubjectCourseCardProps) {
  const progressQuery = useSubjectLessonProgressQuery(subject.id);
  const course = mapSubjectToCourseCard(subject, index);
  const progressItems = progressQuery.data ?? [];
  const progressPercent = computeProgressPercent(progressItems);
  const resumePoint = findResumeInProgressList(subject.id, progressItems);
  const coursePath = resumePoint
    ? getStudentCourseResumePath(String(subject.id), {
        chapterId: resumePoint.chapterId,
        lessonId: resumePoint.lessonId,
        materialId: resumePoint.materialId ?? undefined,
      })
    : getStudentCoursePath(course.slug);
  const actionLabel = resumePoint?.lessonId ? "Học tiếp" : "Vào học";
  const tone = courseToneClass[course.tone];

  return (
    <Link
      className={`group relative flex min-h-64 min-w-0 flex-col justify-between overflow-hidden rounded-xl border p-gutter shadow-lg shadow-landing-text/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${tone.card} ${tone.border}`}
      to={coursePath}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl ${tone.glow}`}
      />
      <span
        aria-hidden="true"
        className="absolute right-5 top-16 font-serif text-6xl font-bold text-landing-text/5"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span
            className={`relative max-w-[70%] truncate rounded-full px-3 py-1 text-label-sm font-semibold shadow-md ${tone.badge}`}
          >
            {course.status}
          </span>
          <span
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg ${tone.icon}`}
          >
            <MaterialIcon>{course.icon}</MaterialIcon>
          </span>
        </div>
        <h3 className="line-clamp-2 text-headline-md font-semibold leading-snug text-landing-text">
          {course.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-label-md leading-6 text-landing-text-soft">
          {course.lessons}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-outline-variant/20">
          <div
            className={`h-full min-w-1.5 rounded-full bg-gradient-to-r transition-all duration-500 ${tone.progress}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-4 text-label-sm font-semibold">
          <span className="text-landing-text-soft">
            {progressQuery.isLoading ? "Đang tải..." : `${progressPercent}% hoàn thành`}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-lg bg-landing-white/80 px-3 py-2 shadow-sm transition group-hover:bg-landing-white ${tone.action}`}
          >
            {actionLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StudentCurriculumSection() {
  const { data: subjects, isLoading, isError, error, refetch } = useSubjects();

  return (
    <section className="space-y-md scroll-mt-24" id="curriculum">
      <StudentDashboardSectionHeader
        description="Các học phần lý luận chính trị trong học kỳ này."
        eyebrow="Lộ trình của bạn"
        icon={Route}
        title="Chương trình học tập"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
          <CurriculumSkeleton />
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter text-on-surface">
          <p className="text-body-md font-medium text-error">
            Không thể tải danh sách khóa học.
          </p>
          <p className="mt-1 text-label-md text-on-surface-variant">
            {error instanceof Error ? error.message : "Vui lòng thử lại sau."}
          </p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-5 py-2 text-label-md font-medium text-on-primary transition hover:bg-landing-red-deep"
            onClick={() => refetch()}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && (subjects?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-outline-variant/35 bg-landing-white p-gutter text-center shadow-lg shadow-landing-text/5">
          <BookOpen aria-hidden="true" className="mx-auto h-10 w-10 text-landing-red" />
          <p className="mt-4 text-headline-md font-semibold text-landing-text">
            Chưa có khóa học nào
          </p>
          <p className="mt-2 text-body-md text-landing-text-soft">
            Giáo viên sẽ thêm môn học vào hệ thống sớm nhất.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && (subjects?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
          {subjects?.map((subject, index) => (
            <SubjectCourseCard index={index} key={subject.id} subject={subject} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
