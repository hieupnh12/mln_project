import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { ExamCard } from "../types/exams.types";
import { ExamStatusPill } from "./exam-status-pill";

type ExamUpcomingCardProps = {
  exam: ExamCard;
  subjectTitle?: string;
};

export function ExamUpcomingCard({ exam, subjectTitle }: ExamUpcomingCardProps) {
  const scheduleLabel = exam.scheduleLabel || "Sắp mở";

  return (
    <article className="rounded-lg border border-outline-variant bg-white p-md transition-all hover:border-secondary">
      <div className="mb-4 flex items-center justify-between">
        <ExamStatusPill label={scheduleLabel} variant="upcoming" />
        <MaterialIcon className="text-on-surface-variant">lock</MaterialIcon>
      </div>
      <h3 className="mb-2 text-label-md font-bold text-primary">{exam.title}</h3>
      <div className="flex flex-col gap-1 text-body-md text-on-surface-variant">
        {subjectTitle ? <span className="text-sm">Môn: {subjectTitle}</span> : null}
        {exam.chapter ? <span className="text-sm">Chương: {exam.chapter}</span> : null}
        {exam.lesson && exam.lesson !== "Tất cả bài" ? (
          <span className="text-sm">Bài: {exam.lesson}</span>
        ) : null}
      </div>
    </article>
  );
}
