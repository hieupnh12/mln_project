import { Link } from "react-router";

import {
  getStudentExamReviewPath,
  getStudentExamSummaryPath,
} from "../../constants/student-routes.constants";
import type { ExamCompletedRow } from "../types/exams.types";
import { ExamStatusPill } from "./exam-status-pill";

type ExamCompletedListProps = {
  courseId: string;
  rows: ExamCompletedRow[];
};

export function ExamCompletedList({ courseId, rows }: ExamCompletedListProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {rows.map((row) => (
        <li
          className="rounded-xl border border-outline-variant/35 bg-landing-white p-4 shadow-sm shadow-landing-text/5"
          key={row.attemptId}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ExamStatusPill
              label={row.passed ? "Đã đạt" : "Chưa đạt"}
              variant={row.passed ? "passed" : "failed"}
            />
            <span className="text-label-sm text-landing-text-soft">{row.submittedAt}</span>
          </div>
          <Link
            className="text-body-md font-semibold text-landing-text hover:text-secondary"
            to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
          >
            {row.title}
          </Link>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Link
              className={row.passed ? "font-bold text-secondary" : "font-bold text-error"}
              to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
            >
              {row.scoreLabel}
            </Link>
            <Link
              className="rounded-lg bg-landing-gray px-3 py-2 text-label-sm font-medium text-landing-text-muted transition hover:bg-secondary-container/45 hover:text-secondary"
              to={getStudentExamReviewPath(courseId, row.quizId, row.attemptId)}
            >
              Chi tiết
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
