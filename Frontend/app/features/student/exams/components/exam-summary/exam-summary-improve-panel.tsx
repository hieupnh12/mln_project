import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import { getStudentExamReviewPath } from "../../../constants/student-routes.constants";
import type { ExamImproveTopic, ExamSummary } from "../../types/exam-summary.types";

type ExamSummaryImprovePanelProps = {
  courseId: string;
  summary: ExamSummary;
};

function borderClass(variant: ExamImproveTopic["variant"]) {
  if (variant === "error") {
    return "border-l-4 border-error/50";
  }
  if (variant === "ok") {
    return "border-l-4 border-secondary/50";
  }
  return "border-l-4 border-outline-variant";
}

export function ExamSummaryImprovePanel({ courseId, summary }: ExamSummaryImprovePanelProps) {
  const topics = summary.improveTopics;

  return (
    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
      <h2 className="mb-md text-headline-md font-semibold text-primary">Cần cải thiện</h2>

      {topics.length === 0 ? (
        <p className="rounded-lg bg-surface-container-low p-sm text-body-md text-on-surface-variant">
          Không có chương nào trả lời sai. Làm tốt lắm!
        </p>
      ) : (
        <div className="space-y-sm">
          {topics.map((topic) => (
            <div
              className={`rounded-lg bg-surface-container-low p-sm ${borderClass(topic.variant)}`}
              key={topic.title}
            >
              <h3 className="text-label-md font-medium text-primary">{topic.title}</h3>
              <p className="mt-1 text-label-sm text-on-surface-variant">{topic.description}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        className="mt-lg flex w-full items-center justify-center gap-2 rounded-lg py-sm text-label-md font-bold text-secondary transition-colors hover:bg-secondary-container/20"
        to={getStudentExamReviewPath(courseId, summary.quizId, summary.attemptId)}
      >
        Xem chi tiết bài làm
        <MaterialIcon className="text-[18px]">arrow_forward</MaterialIcon>
      </Link>
    </div>
  );
}
