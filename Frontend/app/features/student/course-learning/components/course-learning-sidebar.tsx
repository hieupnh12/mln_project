import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import type { LearningTab } from "../../types/student.types";
import { courseTabIcons, courseTabItems } from "../constants/course-tab-config";

const sidebarShellClass =
  "hidden shrink-0 flex-col overflow-hidden border-r border-outline-variant/35 bg-landing-white transition-[width] duration-200 md:fixed md:left-0 md:top-16 md:z-30 md:flex md:h-[calc(100vh-4rem)]";

type CourseLearningSidebarProps = {
  activeTab: LearningTab;
  collapsed: boolean;
  onTabChange: (tab: LearningTab) => void;
  onToggleCollapsed: () => void;
};

export function CourseLearningSidebar({
  activeTab,
  collapsed,
  onTabChange,
  onToggleCollapsed,
}: CourseLearningSidebarProps) {
  return (
    <aside
      aria-label="Điều hướng nội dung khóa học"
      className={
        collapsed
          ? `${sidebarShellClass} w-[4.5rem]`
          : `${sidebarShellClass} w-56 lg:w-60`
      }
    >
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
        {courseTabItems.map((tab) => {
          const Icon = courseTabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={
                isActive
                  ? collapsed
                    ? "flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-secondary text-on-secondary shadow-sm"
                    : "flex min-h-11 w-full shrink-0 items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-left text-label-md font-semibold text-on-secondary shadow-sm"
                  : collapsed
                    ? "flex h-11 w-full shrink-0 items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
                    : "flex min-h-11 w-full shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
              }
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={collapsed ? tab.label : undefined}
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {collapsed ? null : <span className="truncate">{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-outline-variant/25 bg-landing-white p-2">
        <button
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          className={
            collapsed
              ? "flex h-10 w-full items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
              : "flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-label-sm font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
          }
          onClick={onToggleCollapsed}
          type="button"
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
