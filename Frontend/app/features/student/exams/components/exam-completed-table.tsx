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
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-outline-variant bg-white p-gutter text-center text-body-md text-on-surface-variant">
        Chưa có bài kiểm tra đã nộp.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-label-md text-on-surface-variant">Tên bài thi</th>
              <th className="px-6 py-4 text-label-md text-on-surface-variant">Môn học</th>
              <th className="px-6 py-4 text-label-md text-on-surface-variant">Thời gian nộp</th>
              <th className="px-6 py-4 text-right text-label-md text-on-surface-variant">
                Kết quả
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {rows.map((row) => (
              <tr className="transition-colors hover:bg-surface" key={row.attemptId}>
                <td className="px-6 py-4 text-body-md">
                  <Link
                    className="font-medium text-primary underline-offset-2 hover:text-secondary hover:underline"
                    to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {subjectTitle ? (
                    <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold uppercase text-on-secondary-fixed-variant">
                      {subjectTitle}
                    </span>
                  ) : (
                    <span className="text-sm text-on-surface-variant">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{row.submittedAt}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Link
                      className={
                        row.passed
                          ? "font-bold text-secondary underline-offset-2 hover:underline"
                          : "font-bold text-error underline-offset-2 hover:underline"
                      }
                      to={getStudentExamSummaryPath(courseId, row.quizId, row.attemptId)}
                    >
                      {row.scoreLabel}
                    </Link>
                    <Link
                      className="text-label-sm text-on-surface-variant underline-offset-2 hover:text-secondary hover:underline"
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
