import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { studentCourseBottomNavItems } from "../constants/student-course.constants";

export function CourseMobileNavigation() {
  return (
    <nav
      aria-label="Điều hướng khóa học trên điện thoại"
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 items-center rounded-xl border border-outline-variant/35 bg-landing-white/95 p-2 shadow-2xl shadow-landing-text/10 backdrop-blur-xl md:hidden"
    >
      {studentCourseBottomNavItems.map((item) => (
        <Link
          className={
            item.active
              ? "flex min-w-0 flex-col items-center justify-center rounded-lg bg-secondary-container/55 px-1 py-1.5 text-secondary"
              : "flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-1.5 text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
          }
          key={item.label}
          to={item.href}
        >
          <MaterialIcon filled={item.active}>{item.icon}</MaterialIcon>
          <span className="mt-0.5 text-label-sm font-semibold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
