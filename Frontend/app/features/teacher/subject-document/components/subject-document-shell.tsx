import type { ReactNode } from "react";

import { TeacherPageShell } from "../../components/teacher-page-shell";

type SubjectDocumentShellProps = {
  children: ReactNode;
};

export function SubjectDocumentShell({ children }: SubjectDocumentShellProps) {
  return <TeacherPageShell>{children}</TeacherPageShell>;
}
