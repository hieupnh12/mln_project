import type { ReactNode } from "react";

import { TeacherPageShell } from "../../components/teacher-page-shell";

type PdfDocumentShellProps = {
  children: ReactNode;
};

export function PdfDocumentShell({ children }: PdfDocumentShellProps) {
  return <TeacherPageShell>{children}</TeacherPageShell>;
}
