import type { ReactNode } from "react";

import { TeacherPageShell } from "../../components/teacher-page-shell";

type FlashcardShellProps = {
  children: ReactNode;
};

export function FlashcardShell({ children }: FlashcardShellProps) {
  return <TeacherPageShell>{children}</TeacherPageShell>;
}
