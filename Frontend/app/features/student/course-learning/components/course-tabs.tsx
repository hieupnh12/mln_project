import { BookOpen, ClipboardCheck, Layers3, PenLine } from "lucide-react";

import type { LearningTab } from "../../types/student.types";
import { studentCourseTabs } from "../constants/student-course.constants";

const tabIcons = {
  lectures: BookOpen,
  flashcards: Layers3,
  practice: PenLine,
  exams: ClipboardCheck,
} satisfies Record<LearningTab, typeof BookOpen>;

type CourseTabsProps = {
  activeTab: LearningTab;
  onTabChange: (tab: LearningTab) => void;
};

export function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  return (
    <nav
      aria-label="Nội dung khóa học"
      className="sticky top-16 z-40 mb-md border-y border-outline-variant/35 bg-landing-cream/90 py-2 backdrop-blur-xl"
    >
      <div className="flex gap-2 overflow-x-auto scroll-hide">
        {studentCourseTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-pressed={isActive}
              className={
                isActive
                  ? "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-landing-red px-4 py-2 text-label-md font-semibold text-on-primary shadow-lg shadow-landing-red/15"
                  : "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-white hover:text-landing-text"
              }
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
