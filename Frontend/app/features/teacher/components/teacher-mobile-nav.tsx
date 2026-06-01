import { teacherNavItems } from "../constants/teacher-dashboard.constants";
import type { TeacherSectionId } from "../types/teacher-dashboard.types";
import { MaterialIcon } from "./teacher-icons";

export function TeacherMobileNav({
  activeSection,
  onSectionChange,
}: {
  activeSection: TeacherSectionId;
  onSectionChange: (section: TeacherSectionId) => void;
}) {
  return (
    <nav className="mb-md flex gap-sm overflow-x-auto lg:hidden">
      {teacherNavItems.map((item) => (
        <button
          className={
            activeSection === item.id
              ? "flex shrink-0 items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-label-md font-semibold text-on-secondary-container"
              : "flex shrink-0 items-center gap-2 rounded-full border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-on-surface-variant"
          }
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          type="button"
        >
          <MaterialIcon className="h-5 w-5 text-[20px]">{item.icon}</MaterialIcon>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
