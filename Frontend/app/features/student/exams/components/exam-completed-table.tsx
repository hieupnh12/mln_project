import { Link } from "react-router";

import {
  getStudentExamReviewPath,
  getStudentExamSummaryPath,
} from "../../constants/student-routes.constants";
import type { ExamCompletedRow } from "../types/exams.types";

type ExamCompletedTableProps = {
  courseId: string;
  rows: ExamCompletedRow[];
  subjectTitle?: string;
};

export function ExamCompletedTable({ courseId, rows, subjectTitle }: ExamCompletedTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-sm shadow-landing-text/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="border-b border-outline-variant/30 bg-landing-gray">
            <tr>
              <th className="px-6 py-4 text-label-md text-landing-text-muted">Tên bài thi</th>
              <th className="px-6 py-4 text-label-md text-landing-text-muted">Môn học</th>
              <th className="px-6 py-4 text-label-md text-landing-text-muted">Thời gian nộp</th>
              <th className="px-6 py-4 text-right text-label-md text-landing-text-muted">
                Kết quả
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/25">
            {rows.map((row) => (
              <tr className="transition-colors hover:bg-landing-gray/70" key={row.attemptId}>
                <td className="px-6 py-4">
                  <Link
                    className="font-semibold text-landing-text hover:text-secondary"
                    to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-secondary-container/45 px-3 py-1 text-label-sm font-semibold text-secondary">
                    {subjectTitle || "Mác - Lê Nin"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-landing-text-soft">{row.submittedAt}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Link
                      className={row.passed ? "font-bold text-secondary" : "font-bold text-error"}
                      to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
                    >
                      {row.scoreLabel}
                    </Link>
                    <Link
                      className="rounded-lg bg-landing-gray px-2.5 py-1.5 text-label-sm font-medium text-landing-text-muted transition hover:bg-secondary-container/45 hover:text-secondary"
                      to={getStudentExamReviewPath(courseId, row.quizId, row.attemptId)}
                    >
                      Chi tiết từng câu
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
