import { Link } from "react-router";

import { useSubjects } from "../hooks/dashboard.hooks";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCoursePath,
  getStudentCourseResumePath,
} from "../../constants/student-routes.constants";
import { courseToneClass } from "../constants/student-dashboard.constants";
import { useSubjectLessonProgressQuery } from "../../student-progress/hooks/use-student-progress-queries";
import {
  computeProgressPercent,
  findResumeInProgressList,
} from "../../student-progress/utils/student-progress-resume.util";
import { mapSubjectToCourseCard } from "../utils/map-subject-to-course-card";

function CurriculumSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="min-h-64 animate-pulse rounded-xl border border-outline-variant/40 bg-surface-container-low p-gutter"
          key={index}
        >
          <div className="mb-4 h-6 w-24 rounded-full bg-surface-container" />
          <div className="mb-3 h-8 w-4/5 rounded-lg bg-surface-container" />
          <div className="mt-auto h-1.5 w-full rounded-full bg-surface-container" />
        </div>
      ))}
    </>
  );
}

type SubjectCourseCardProps = {
  subjectId: number;
  index: number;
};

function SubjectCourseCard({ subjectId, index }: SubjectCourseCardProps) {
  const { data: subjects } = useSubjects();
  const subject = subjects?.find((item) => item.id === subjectId);
  const progressQuery = useSubjectLessonProgressQuery(subjectId);

  if (!subject) {
    return null;
  }

  const course = mapSubjectToCourseCard(subject, index);
  const progressItems = progressQuery.data ?? [];
  const progressPercent = computeProgressPercent(progressItems);
  const resumePoint = findResumeInProgressList(subjectId, progressItems);
  const coursePath = resumePoint
    ? getStudentCourseResumePath(String(subjectId), {
        chapterId: resumePoint.chapterId,
        lessonId: resumePoint.lessonId,
        materialId: resumePoint.materialId ?? undefined,
      })
    : getStudentCoursePath(course.slug);
  const actionLabel = resumePoint?.lessonId ? "Học tiếp" : "Vào học";
  const tone = courseToneClass[course.tone as keyof typeof courseToneClass];

  return (
    <Link
      className={`group flex min-h-64 cursor-pointer flex-col justify-between rounded-xl border p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(35,39,51,0.08)] ${tone.card} ${tone.border}`}
      to={coursePath}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <span
            className={`rounded-full bg-white/50 px-3 py-1 text-label-sm font-semibold ${tone.text}`}
          >
            {course.status}
          </span>
          <MaterialIcon className={tone.text}>{course.icon}</MaterialIcon>
        </div>
        <h3 className="text-headline-md font-semibold leading-snug text-primary">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-label-md text-on-surface-variant">
          {course.lessons}
        </p>
      </div>

      <div className="space-y-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/40">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div
          className={`flex justify-between gap-4 text-label-sm font-semibold ${tone.text}`}
        >
          <span>{progressQuery.isLoading ? "..." : `${progressPercent}% Hoàn thành`}</span>
          <span>{actionLabel}</span>
        </div>
      </div>
    </Link>
  );
}

export function StudentCurriculumSection() {
  const { data: subjects, isLoading, isError, error, refetch, isFetching } =
    useSubjects();

  return (
    <section className="space-y-md" id="curriculum">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h2 className="text-headline-lg font-semibold text-primary">
            Chương trình học tập
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Các khóa học lý luận chính trị trọng tâm cho học kỳ này.
          </p>
        </div>
        {!isLoading && (subjects?.length ?? 0) > 0 ? (
          <span className="flex w-fit items-center gap-1 text-label-md font-medium text-on-surface-variant">
            {subjects?.length} khóa học
            {isFetching ? (
              <MaterialIcon className="h-[18px] w-[18px] animate-spin text-[18px]">
                progress_activity
              </MaterialIcon>
            ) : null}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
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
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary transition hover:opacity-90"
            onClick={() => refetch()}
            type="button"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && (subjects?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <MaterialIcon className="mx-auto mb-3 text-[40px] text-on-surface-variant">
            menu_book
          </MaterialIcon>
          <p className="text-headline-md font-semibold text-primary">
            Chưa có khóa học nào
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Giáo viên sẽ thêm môn học vào hệ thống sớm nhất.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && (subjects?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {subjects?.map((subject, index) => (
            <SubjectCourseCard index={index} key={subject.id} subjectId={subject.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
