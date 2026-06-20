import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";
import { normalizeApiError } from "~/shared/services/api-client";
import { showErrorToast } from "~/shared/utils/toast";

import { getStudentExamSessionPath } from "../../constants/student-routes.constants";
import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { useStudentExamsQuery } from "../hooks/use-student-exams-query";
import { getExamSession } from "../services/exams.service";
import { ExamCatalogGrid } from "./exam-catalog-grid";
import { ExamCatalogIntro } from "./exam-catalog-intro";
import { ExamCatalogSection } from "./exam-catalog-section";
import { ExamCatalogSkeleton } from "./exam-catalog-skeleton";
import { ExamCompletedList } from "./exam-completed-list";
import { ExamCompletedTable } from "./exam-completed-table";
import { ExamEmptyState } from "./exam-empty-state";
import { ExamLoginBanner } from "./exam-login-banner";

type CourseExamCatalogPanelProps = {
  subjectId: number;
  active: boolean;
  courseTitle?: string;
};

export function CourseExamCatalogPanel({
  subjectId,
  active,
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
  const isCatalogEmpty =
    catalog.ongoing.length === 0 &&
    catalog.upcoming.length === 0 &&
    catalog.completed.length === 0;

  return (
    <div className="flex flex-col gap-lg">
      {!isLoggedIn ? <ExamLoginBanner /> : null}

      <ExamCatalogIntro />

      {examsQuery.isFetching && !examsQuery.isLoading ? (
        <p className="-mt-sm text-label-sm text-landing-text-soft">Đang cập nhật...</p>
      ) : null}

      {isCatalogEmpty ? (
        <ExamEmptyState
          description="Giảng viên chưa xuất bản bài kiểm tra cho môn học này."
          icon="quiz"
          title="Chưa có bài kiểm tra"
        />
      ) : (
        <>
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
              <ExamCatalogGrid
                exams={catalog.ongoing}
                onStart={handleStartExam}
                retakeQuizIds={retakeQuizIds}
              />
            )}
          </ExamCatalogSection>

          {catalog.upcoming.length > 0 ? (
            <ExamCatalogSection icon="event" title="Sắp tới" tone="upcoming">
              <ExamCatalogGrid exams={catalog.upcoming} locked />
            </ExamCatalogSection>
          ) : null}

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
