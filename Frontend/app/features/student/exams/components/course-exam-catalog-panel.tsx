import { useMemo } from "react";
import { useNavigate } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";
import { normalizeApiError } from "~/shared/services/api-client";
import { showErrorToast } from "~/shared/utils/toast";

import { getStudentExamSessionPath } from "../../constants/student-routes.constants";
import { useStudentExamsQuery } from "../hooks/use-student-exams-query";
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
    <div className="flex flex-col gap-lg">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-md" key={index}>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-container" />
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-lg bg-surface-container-low" />
            <div className="h-56 animate-pulse rounded-lg bg-surface-container-low" />
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
  const isLoggedIn = Boolean(getAuthSession()?.accessToken);
  const examsQuery = useStudentExamsQuery({ subjectId, enabled: active });

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
        <p className="mt-2 text-body-sm text-on-surface-variant">{errorMessage}</p>
        <button
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-on-primary"
          onClick={() => void examsQuery.refetch()}
          type="button"
        >
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
  const ongoingCount = catalog.ongoing.length;
  const isCatalogEmpty =
    catalog.ongoing.length === 0 &&
    catalog.upcoming.length === 0 &&
    catalog.completed.length === 0;

  return (
    <div className="flex flex-col gap-lg">
      {examsQuery.isFetching && !examsQuery.isLoading ? (
        <p className="text-center text-label-sm text-on-surface-variant">Đang cập nhật...</p>
      ) : null}

      {!isLoggedIn ? <ExamLoginBanner /> : null}

      <header className="mb-md">
        <h1 className="text-headline-lg font-semibold text-primary">Danh sách bài kiểm tra</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {displayCourseTitle
            ? `Môn ${displayCourseTitle} — hoàn thành các bài kiểm tra đúng hạn để duy trì kết quả học tập tốt.`
            : "Hoàn thành các bài kiểm tra đúng hạn để duy trì kết quả học tập tốt."}
        </p>
      </header>

      {isCatalogEmpty ? (
        <ExamEmptyState
          description="Giảng viên chưa xuất bản bài kiểm tra cho môn học này, hoặc các bài đang được chuẩn bị."
          icon="quiz"
          title="Chưa có bài kiểm tra"
        />
      ) : (
        <>
          <ExamCatalogSection
            badge={ongoingCount > 0 ? `${ongoingCount} bài` : undefined}
            icon="play_circle"
            iconFilled
            title="Đang diễn ra"
          >
            {catalog.ongoing.length === 0 ? (
              <ExamEmptyState
                description="Các bài đã đạt hoặc chưa đến hạn mở sẽ không hiển thị tại đây."
                icon="event_available"
                title="Hiện chưa có bài kiểm tra đang mở"
              />
            ) : (
              <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
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

          <ExamCatalogSection icon="event" title="Sắp tới">
            {catalog.upcoming.length === 0 ? (
              <ExamEmptyState
                description="Bài chưa có câu hỏi hoặc chưa đến thời gian mở sẽ hiển thị tại đây."
                icon="schedule"
                title="Không có bài kiểm tra sắp mở"
              />
            ) : (
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                {catalog.upcoming.map((exam) => (
                  <ExamUpcomingCard exam={exam} key={exam.id} subjectTitle={displayCourseTitle} />
                ))}
              </div>
            )}
          </ExamCatalogSection>

          <ExamCatalogSection icon="check_circle" muted title="Đã hoàn thành">
            {catalog.completed.length === 0 ? (
              <ExamEmptyState
                description={
                  isLoggedIn
                    ? "Kết quả các bài bạn đã nộp sẽ xuất hiện tại đây."
                    : "Đăng nhập để xem lịch sử làm bài và điểm số."
                }
                icon="history"
                title="Chưa có bài kiểm tra đã nộp"
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
