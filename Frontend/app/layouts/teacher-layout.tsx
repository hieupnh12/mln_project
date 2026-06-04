import { Outlet } from "react-router";

import { TeacherMobileNav } from "../features/teacher/components/teacher-mobile-nav";
import { TeacherSidebar } from "../features/teacher/components/teacher-sidebar";

export function TeacherLayout() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface">
      <TeacherSidebar />

      <main className="px-margin-mobile pb-xl pt-md md:px-margin-desktop lg:ml-64">
        <TeacherMobileNav />
        <Outlet />
      </main>
    </div>
  );
}
