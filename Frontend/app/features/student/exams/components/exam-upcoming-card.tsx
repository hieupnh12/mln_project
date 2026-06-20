import { LockKeyhole } from "lucide-react";

import type { ExamCard } from "../types/exams.types";
import { ExamStatusPill } from "./exam-status-pill";

type ExamUpcomingCardProps = {
  exam: ExamCard;
  subjectTitle?: string;
};

export function ExamUpcomingCard({ exam, subjectTitle }: ExamUpcomingCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-landing-gold/25 bg-landing-white p-md shadow-sm shadow-landing-text/5 transition hover:border-landing-gold/45 hover:shadow-md">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-landing-gold" />
      <div className="mb-4 flex items-center justify-between gap-3">
        <ExamStatusPill label={exam.scheduleLabel || "Sắp mở"} variant="upcoming" />
        <LockKeyhole aria-hidden="true" className="h-5 w-5 text-landing-text-soft" />
      </div>
      <h3 className="mb-3 text-label-md font-bold text-landing-text">{exam.title}</h3>
      <div className="flex flex-col gap-1 text-sm text-landing-text-soft">
        {subjectTitle ? <span>Môn: {subjectTitle}</span> : null}
        {exam.chapter ? <span>Chương: {exam.chapter}</span> : null}
        {exam.lesson && exam.lesson !== "Tất cả bài" ? (
          <span>Bài: {exam.lesson}</span>
        ) : null}
      </div>
    </article>
  );
}
