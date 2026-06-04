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
          className="rounded-lg border border-outline-variant bg-white p-4 shadow-sm"
          key={row.attemptId}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ExamStatusPill
              label={row.passed ? "Đã đạt" : "Chưa đạt"}
              variant={row.passed ? "passed" : "failed"}
            />
            <span className="text-label-sm text-on-surface-variant">{row.submittedAt}</span>
          </div>
          <Link
            className="text-body-md font-medium text-primary underline-offset-2 hover:text-secondary hover:underline"
            to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
          >
            {row.title}
          </Link>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Link
              className={
                row.passed
                  ? "text-label-md font-bold text-secondary"
                  : "text-label-md font-bold text-error"
              }
              to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
            >
              {row.scoreLabel}
            </Link>
            <Link
              className="text-label-sm text-on-surface-variant underline-offset-2 hover:text-secondary hover:underline"
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
