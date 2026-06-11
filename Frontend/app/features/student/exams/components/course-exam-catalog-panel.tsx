import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";
import { normalizeApiError } from "~/shared/services/api-client";
import { showErrorToast } from "~/shared/utils/toast";

import { getStudentExamSessionPath } from "../../constants/student-routes.constants";
import { useStudentExamsQuery } from "../hooks/use-student-exams-query";
import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { getExamSession } from "../services/exams.service";
import { ExamCatalogSection } from "./exam-catalog-section";
import { ExamCompletedList } from "./exam-completed-list";
import { ExamCompletedTable } from "./exam-completed-table";
import { ExamEmptyState } from "./exam-empty-state";
import { ExamLoginBanner } from "./exam-login-banner";
import { ExamOngoingCard } from "./exam-ongoing-card";
import { ExamUpcomingCard } from "./exam-upcoming-card";

type CourseExamCatalogPanelProps = {
  subjectId: number;
  active: boolean;
  courseTitle?: string;
};

function ExamCatalogSkeleton() {
  return (
    <div className="flex flex-col gap-xl">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-md" key={index}>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-landing-gray" />
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-xl bg-landing-white" />
            <div className="h-56 animate-pulse rounded-xl bg-landing-white" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CourseExamCatalogPanel({
  subjectId,
  active,
  courseTitle,
}: CourseExamCatalogPanelProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLoggedIn = Boolean(getAuthSession()?.accessToken);
  const examsQuery = useStudentExamsQuery({ subjectId, enabled: active });

  const ongoingExams = examsQuery.data?.ongoing ?? [];

  useEffect(() => {
    if (ongoingExams.length === 0 || !subjectId) {
      return;
    }
    ongoingExams.forEach((exam) => {
      void queryClient.prefetchQuery({
        queryKey: EXAMS_QUERY_KEYS.session(subjectId, exam.id),
        queryFn: () => getExamSession(subjectId, exam.id),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [ongoingExams, subjectId, queryClient]);

  const retakeQuizIds = useMemo(() => {
    const completed = examsQuery.data?.completed ?? [];
    return new Set(completed.filter((row) => !row.passed).map((row) => row.quizId));
  }, [examsQuery.data?.completed]);

  function handleStartExam(examId: string) {
    if (!isLoggedIn) {
      showErrorToast("Vui lòng đăng nhập để làm bài kiểm tra.");
      return;
    }
    navigate(getStudentExamSessionPath(String(subjectId), examId));
  }

  if (!active) {
    return null;
  }
  if (examsQuery.isLoading) {
    return <ExamCatalogSkeleton />;
  }
  if (examsQuery.isError) {
    const errorMessage = normalizeApiError(examsQuery.error).message;

    return (
      <article className="rounded-xl border border-error/30 bg-error-container/20 p-gutter text-center">
        <p className="text-body-md font-medium text-error">
          Không tải được danh sách bài kiểm tra.
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">{errorMessage}</p>
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-4 py-2 text-label-md font-medium text-on-primary"
          onClick={() => void examsQuery.refetch()}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Thử lại
        </button>
      </article>
    );
  }

  const catalog = examsQuery.data ?? {
    subjectTitle: "",
    ongoing: [],
    upcoming: [],
    completed: [],
  };
  const displayCourseTitle = courseTitle || catalog.subjectTitle;
  const isCatalogEmpty =
    catalog.ongoing.length === 0 &&
    catalog.upcoming.length === 0 &&
    catalog.completed.length === 0;

  return (
    <div className="flex flex-col gap-lg">
      {!isLoggedIn ? <ExamLoginBanner /> : null}

      <header className="border-b border-outline-variant/30 pb-md">
        <h1 className="mt-2 font-serif text-headline-md font-semibold text-landing-text md:text-headline-lg">
          Danh sách bài kiểm tra
        </h1>
        <p className="mt-2 max-w-3xl text-body-md text-landing-text-soft">
          {displayCourseTitle
            ? `Theo dõi các bài kiểm tra của môn ${displayCourseTitle} và hoàn thành đúng hạn.`
            : "Hoàn thành bài kiểm tra đúng hạn để duy trì kết quả học tập."}
        </p>
        {examsQuery.isFetching && !examsQuery.isLoading ? (
          <p className="mt-2 text-label-sm text-landing-text-soft">Đang cập nhật...</p>
        ) : null}
      </header>

      {isCatalogEmpty ? (
        <ExamEmptyState
          description="Giảng viên chưa xuất bản bài kiểm tra cho môn học này."
          icon="quiz"
          title="Chưa có bài kiểm tra"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 items-start gap-lg xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
            <ExamCatalogSection
              badge={catalog.ongoing.length > 0 ? `${catalog.ongoing.length} bài` : undefined}
              icon="play_circle"
              iconFilled
              title="Đang diễn ra"
              tone="active"
            >
              {catalog.ongoing.length === 0 ? (
                <ExamEmptyState
                  description="Hiện không có bài kiểm tra nào đang mở."
                  icon="event_available"
                  title="Chưa có bài đang mở"
                  tone="active"
                />
              ) : (
                <div className="grid grid-cols-1 gap-gutter 2xl:grid-cols-2">
                  {catalog.ongoing.map((exam) => (
                    <ExamOngoingCard
                      exam={exam}
                      isRetake={retakeQuizIds.has(exam.id)}
                      key={exam.id}
                      onStart={handleStartExam}
                    />
                  ))}
                </div>
              )}
            </ExamCatalogSection>

            <ExamCatalogSection icon="event" title="Sắp tới" tone="upcoming">
              {catalog.upcoming.length === 0 ? (
                <ExamEmptyState
                  compact
                  description="Các bài sắp mở sẽ xuất hiện tại đây."
                  icon="schedule"
                  title="Không có bài kiểm tra sắp mở"
                  tone="upcoming"
                />
              ) : (
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-1">
                  {catalog.upcoming.map((exam) => (
                    <ExamUpcomingCard
                      exam={exam}
                      key={exam.id}
                      subjectTitle={displayCourseTitle}
                    />
                  ))}
                </div>
              )}
            </ExamCatalogSection>
          </div>

          <ExamCatalogSection icon="check_circle" title="Đã hoàn thành" tone="neutral">
            {catalog.completed.length === 0 ? (
              <ExamEmptyState
                description="Kết quả các bài bạn đã nộp sẽ xuất hiện tại đây."
                icon="history"
                title="Chưa có bài đã nộp"
              />
            ) : (
              <>
                <ExamCompletedList courseId={String(subjectId)} rows={catalog.completed} />
                <div className="hidden md:block">
                  <ExamCompletedTable
                    courseId={String(subjectId)}
                    rows={catalog.completed}
                    subjectTitle={displayCourseTitle}
                  />
                </div>
              </>
            )}
          </ExamCatalogSection>
        </>
      )}
    </div>
  );
}
