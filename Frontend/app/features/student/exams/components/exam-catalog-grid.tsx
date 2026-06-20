import { useState } from "react";

import type { ExamCard } from "../types/exams.types";
import { EXAM_CATALOG_PAGE_SIZE } from "../constants/exam-catalog.constants";
import { ExamCatalogCard } from "./exam-catalog-card";

type ExamCatalogGridProps = {
  exams: ExamCard[];
  locked?: boolean;
  onStart?: (examId: string) => void;
  retakeQuizIds?: Set<string>;
};

export function ExamCatalogGrid({
  exams,
  locked = false,
  onStart,
  retakeQuizIds,
}: ExamCatalogGridProps) {
  const [visibleCount, setVisibleCount] = useState(EXAM_CATALOG_PAGE_SIZE);
  const visibleExams = exams.slice(0, visibleCount);
  const remainingCount = exams.length - visibleCount;

  return (
    <div>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleExams.map((exam, index) => (
          <ExamCatalogCard
            exam={exam}
            index={index}
            isRetake={retakeQuizIds?.has(exam.id)}
            key={exam.id}
            locked={locked}
            onStart={onStart}
          />
        ))}
      </div>

      {remainingCount > 0 ? (
        <div className="mt-md flex justify-center">
          <button
            className="inline-flex items-center justify-center rounded-full border border-landing-red bg-landing-white px-6 py-2.5 text-label-md font-semibold text-landing-red transition hover:bg-landing-red/5"
            onClick={() => setVisibleCount((count) => count + EXAM_CATALOG_PAGE_SIZE)}
            type="button"
          >
            Xem thêm {remainingCount} bài kiểm tra
          </button>
        </div>
      ) : null}

      {visibleCount > EXAM_CATALOG_PAGE_SIZE && remainingCount === 0 ? (
        <div className="mt-sm flex justify-center">
          <button
            className="text-label-sm font-medium text-landing-text-soft transition hover:text-landing-text"
            onClick={() => setVisibleCount(EXAM_CATALOG_PAGE_SIZE)}
            type="button"
          >
            Thu gọn
          </button>
        </div>
      ) : null}
    </div>
  );
}
