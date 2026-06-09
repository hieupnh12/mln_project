import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { ApiRequestError } from "~/shared/services/api-client";
import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCourseExamsTabPath,
  getStudentExamSessionPath,
} from "../../constants/student-routes.constants";
import { ExamReviewQuestionCard } from "../components/exam-review/exam-review-question-card";
import { ExamReviewSkeleton } from "../components/exam-review/exam-review-skeleton";
import { getAuthSession } from "~/shared/services/auth-session.service";

import { useExamReviewQuery } from "../hooks/use-exam-review-query";

function parseCourseId(value: string | undefined) {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function StudentExamReviewPage() {
  const { courseId, quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const subjectId = useMemo(() => parseCourseId(courseId), [courseId]);
  const isLoggedIn = Boolean(getAuthSession()?.accessToken);

  const reviewQuery = useExamReviewQuery({
    subjectId,
    attemptId,
  });

  const review = reviewQuery.data;
  if (subjectId == null || !attemptId) {
    return (
      <div className="flex min-h-svh items-center justify-center p-gutter">
        <p className="text-error">Liên kết xem bài làm không hợp lệ.</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="text-error">Vui lòng đăng nhập để xem chi tiết bài làm.</p>
        <Link className="text-label-md font-medium text-secondary underline" to="/login">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (reviewQuery.isLoading) {
    return <ExamReviewSkeleton />;
  }

  if (reviewQuery.isError || !review) {
    const errorMessage =
      reviewQuery.error instanceof ApiRequestError
        ? reviewQuery.error.message
        : "Không tải được chi tiết bài làm.";

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="max-w-lg text-center text-error">{errorMessage}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="rounded-lg bg-primary px-4 py-2.5 text-label-md font-medium text-on-primary"
            onClick={() => void reviewQuery.refetch()}
            type="button"
          >
            Thử lại
          </button>
          <Link
            className="text-label-md font-medium text-secondary underline"
            to={getStudentCourseExamsTabPath(String(subjectId))}
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const resolvedQuizId = quizId ?? review.quizId;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background antialiased">
      <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-low px-margin-mobile shadow-sm md:px-margin-desktop">
        <span className="text-headline-md font-bold text-primary">ML Learning</span>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-all hover:opacity-90 active:scale-95 md:px-6"
          onClick={() => navigate(getStudentExamSessionPath(String(subjectId), resolvedQuizId))}
          type="button"
        >
          Làm lại
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low p-4 lg:flex">
          <div className="mb-6 px-2 py-4">
            <h2 className="text-headline-md font-semibold text-primary">Xem lại bài làm</h2>
            <p className="mt-1 text-label-md text-on-surface-variant opacity-80">
              Điểm: {review.scorePercent}% • {review.scoreLabel}
            </p>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              Nộp lúc: {review.submittedAt}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-xl bg-secondary-container px-4 py-3 text-label-md text-on-secondary-container">
              <MaterialIcon>list_alt</MaterialIcon>
              Danh sách câu hỏi
            </div>
          </div>
          <p className="mt-auto px-2 text-label-sm text-on-surface-variant">
            {review.correctCount}/{review.totalQuestions} câu đúng
            {review.passed ? " • Đạt" : " • Chưa đạt"}
          </p>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto scroll-hide p-margin-mobile md:p-margin-desktop">
          <div className="mx-auto max-w-[720px] pb-xl">
            <header className="mb-lg">
              <Link
                className="mb-2 flex items-center gap-2 text-label-md text-on-surface-variant transition-colors hover:text-primary"
                to={getStudentCourseExamsTabPath(String(subjectId))}
              >
                <MaterialIcon className="text-[18px]">arrow_back</MaterialIcon>
                Quay lại khóa học
              </Link>
              <h1 className="mb-2 text-headline-lg font-semibold text-primary">
                Xem chi tiết bài làm
              </h1>
              <p className="text-body-md text-on-surface-variant">
                {review.quizTitle} — {review.courseTitle}. Xem phản hồi từng câu để cải thiện
                kết quả học tập.
              </p>
            </header>

            <section className="space-y-gutter">
              {review.questions.map((question) => (
                <ExamReviewQuestionCard item={question} key={question.id} />
              ))}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
