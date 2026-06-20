import { TeacherPageShell } from "../../components/teacher-page-shell";
import { TeacherSubjectList } from "../components/teacher-subject-list";

export function CourseStructurePage() {
  return (
    <TeacherPageShell>
      <TeacherSubjectList />
    </TeacherPageShell>
  );
}
