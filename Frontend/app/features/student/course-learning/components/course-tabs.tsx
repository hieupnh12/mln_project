import type { LearningTab } from "../../types/student.types";
import { courseTabIcons, courseTabItems } from "../constants/course-tab-config";

type CourseTabsProps = {
  activeTab: LearningTab;
  onTabChange: (tab: LearningTab) => void;
  className?: string;
};

export function CourseTabs({ activeTab, onTabChange, className = "" }: CourseTabsProps) {
  return (
    <nav
      aria-label="Nội dung khóa học"
      className={`mb-md rounded-xl border border-outline-variant/35 bg-landing-white py-2 md:hidden ${className}`.trim()}
    >
      <div className="flex gap-2 overflow-x-auto px-2 scroll-hide">
        {courseTabItems.map((tab) => {
          const Icon = courseTabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-pressed={isActive}
              className={
                isActive
                  ? "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-label-md font-semibold text-on-secondary shadow-sm"
                  : "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
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
