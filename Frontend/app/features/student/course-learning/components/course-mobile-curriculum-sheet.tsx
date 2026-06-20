import { useEffect } from "react";

import type { CourseMaterialSummary } from "../types/course-learning.types";
import { CourseCurriculumPanel } from "./course-curriculum-panel";

type CourseMobileCurriculumSheetProps = {
  expandedChapterId: number | null;
  expandedLessonId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectMaterial: (material: CourseMaterialSummary, chapterId: number) => void;
  onToggleChapter: (chapterId: number) => void;
  onToggleLesson: (chapterId: number, lessonId: number) => void;
  selectedMaterialId: number | null;
  subjectId: number;
};

export function CourseMobileCurriculumSheet({
  expandedChapterId,
  expandedLessonId,
  isOpen,
  onClose,
  onSelectMaterial,
  onToggleChapter,
  onToggleLesson,
  selectedMaterialId,
  subjectId,
}: CourseMobileCurriculumSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div aria-hidden={false} className="fixed inset-0 z-[60] md:hidden">
      <button
        aria-label="Đóng lộ trình môn học"
        className="absolute inset-0 bg-landing-text/40"
        onClick={onClose}
        type="button"
      />

      <section
        aria-label="Lộ trình môn học"
        aria-modal="true"
        className="absolute inset-x-0 bottom-20 flex max-h-[min(75svh,calc(100svh-9rem))] flex-col overflow-hidden rounded-t-2xl border border-outline-variant/35 bg-landing-white p-4 shadow-2xl shadow-landing-text/15"
        role="dialog"
      >
        <CourseCurriculumPanel
          expandedChapterId={expandedChapterId}
          expandedLessonId={expandedLessonId}
          onClose={onClose}
          onSelectMaterial={onSelectMaterial}
          onToggleChapter={onToggleChapter}
          onToggleLesson={onToggleLesson}
          selectedMaterialId={selectedMaterialId}
          showCloseButton
          subjectId={subjectId}
        />
      </section>
    </div>
  );
}
