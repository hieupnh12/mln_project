import type { ReactNode } from "react";

import { TEACHER_PORTAL_SOFT_SHADOW } from "../constants/teacher-ui.constants";

type TeacherPageShellProps = {
  children: ReactNode;
};

export function TeacherPageShell({ children }: TeacherPageShellProps) {
  return (
    <div className="relative w-full pb-1">
      <div
        aria-hidden="true"
        className={`absolute inset-x-2 top-3 bottom-0 rounded-[24px] bg-landing-white/50 ${TEACHER_PORTAL_SOFT_SHADOW}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-x-1 top-1.5 bottom-0 rounded-[24px] bg-landing-white/75 ${TEACHER_PORTAL_SOFT_SHADOW}`}
      />

      <div
        className={`relative overflow-hidden rounded-[24px] bg-landing-white p-4 md:p-6 ${TEACHER_PORTAL_SOFT_SHADOW}`}
      >
        {children}
      </div>
    </div>
  );
}
