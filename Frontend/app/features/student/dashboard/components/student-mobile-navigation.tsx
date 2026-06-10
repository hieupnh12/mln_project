import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { studentDashboardBottomNavItems } from "../constants/student-dashboard.constants";

export function StudentMobileNavigation() {
  return (
    <nav
      aria-label="Điều hướng học viên trên điện thoại"
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-xl border border-outline-variant/35 bg-landing-white/90 px-2 py-2 shadow-2xl shadow-landing-text/10 backdrop-blur-xl md:hidden"
    >
      {studentDashboardBottomNavItems.map((item) => (
        <Link
          className={
            item.active
              ? "flex min-w-16 flex-col items-center justify-center rounded-lg bg-landing-red/10 px-3 py-1.5 text-landing-red"
              : "flex min-w-16 flex-col items-center justify-center rounded-lg px-3 py-1.5 text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
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
