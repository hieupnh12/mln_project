import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { showErrorToast } from "~/shared/utils/toast";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCourseExamsTabPath,
  getStudentExamSummaryPath,
} from "../../constants/student-routes.constants";
import { ExamSummaryActions } from "../components/exam-summary/exam-summary-actions";
import { ExamSummaryDifficultyPanel } from "../components/exam-summary/exam-summary-difficulty-panel";
import { ExamSummaryHero } from "../components/exam-summary/exam-summary-hero";
import { ExamSummaryImprovePanel } from "../components/exam-summary/exam-summary-improve-panel";
import { ExamSummaryMeta } from "../components/exam-summary/exam-summary-meta";
import { ExamSummaryStats } from "../components/exam-summary/exam-summary-stats";
import { getAuthSession } from "~/shared/services/auth-session.service";

import { useExamSummaryQuery } from "../hooks/use-exam-summary-query";
import type { ExamSummary } from "../types/exam-summary.types";
import { loadExamSummary } from "../utils/exam-summary-storage";
import { normalizeExamSummary } from "../utils/normalize-exam-summary";

type SummaryLocationState = {
  summary?: ExamSummary;
};

function parseCourseId(value: string | undefined) {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function StudentExamSummaryPage() {
  const { courseId, quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const subjectId = useMemo(() => parseCourseId(courseId), [courseId]);
  const isLoggedIn = Boolean(getAuthSession()?.accessToken);

  const stateSummaryRaw = (location.state as SummaryLocationState | null)?.summary;
  const stateSummary = stateSummaryRaw ? normalizeExamSummary(stateSummaryRaw) : null;
  const cachedSummary = attemptId ? loadExamSummary(attemptId) : null;

  const summaryQuery = useExamSummaryQuery({
    subjectId,
    attemptId,
  });

  const summary =
    (summaryQuery.data ? normalizeExamSummary(summaryQuery.data) : null) ??
    stateSummary ??
    cachedSummary;

  useEffect(() => {
    if (summaryQuery.isError) {
      showErrorToast("Không tải được tổng kết bài làm. Vui lòng thử lại.");
    }
  }, [summaryQuery.isError]);

  useEffect(() => {
    if (summary == null || subjectId == null || !attemptId || !quizId) {
      return;
    }
    if (summary.quizId !== quizId) {
      navigate(getStudentExamSummaryPath(String(subjectId), summary.quizId, attemptId), {
        replace: true,
        state: { summary },
      });
    }
  }, [attemptId, navigate, quizId, subjectId, summary]);

  if (subjectId == null || !quizId || !attemptId) {
    return (
      <div className="flex min-h-svh items-center justify-center p-gutter">
        <p className="text-error">Liên kết tổng kết không hợp lệ.</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="text-error">Vui lòng đăng nhập để xem tổng kết bài làm.</p>
        <Link className="text-label-md font-medium text-secondary underline" to="/login">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (!summary && summaryQuery.isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-on-surface-variant">Đang tải tổng kết...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="text-error">Không tải được tổng kết bài làm.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {summaryQuery.isError ? (
            <button
              className="rounded-lg bg-primary px-md py-sm text-label-md text-on-primary"
              onClick={() => void summaryQuery.refetch()}
              type="button"
            >
              Thử lại
            </button>
          ) : null}
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

  return (
    <div className="min-h-svh bg-background font-body-md text-on-surface">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-background px-margin-mobile shadow-sm md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <button
            aria-label="Đóng"
            className="rounded-full p-2 transition-colors hover:bg-surface-container-high"
            onClick={() => navigate(getStudentCourseExamsTabPath(String(subjectId)))}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
          <span className="text-headline-md font-bold text-primary">ML Learning</span>
        </div>
        <span className="max-w-[40%] truncate text-right text-label-md font-semibold text-secondary sm:max-w-none">
          {summary.scoreLabel}
        </span>
      </header>

      <main className="mx-auto max-w-6xl px-margin-mobile py-lg pb-32 md:px-margin-desktop">
        <ExamSummaryMeta summary={summary} />
        <ExamSummaryHero summary={summary} />
        <ExamSummaryStats summary={summary} />

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
          <ExamSummaryDifficultyPanel summary={summary} />
          <ExamSummaryImprovePanel courseId={String(subjectId)} summary={summary} />
        </div>

        <ExamSummaryActions courseId={String(subjectId)} passed={summary.passed} quizId={summary.quizId} />
      </main>
    </div>
  );
}
