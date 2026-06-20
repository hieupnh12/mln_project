import { Link } from "react-router";

import { TeacherPageShell } from "../../components/teacher-page-shell";
import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import { CourseStructureManager } from "../components/course-structure-manager";

type CourseStructureDetailPageProps = {
  subjectId: number;
};

export function CourseStructureDetailPage({ subjectId }: CourseStructureDetailPageProps) {
  if (Number.isNaN(subjectId)) {
    return (
      <TeacherPageShell>
        <div className="mx-auto max-w-lg rounded-2xl border border-error/30 bg-error-container/30 p-gutter text-center">
          <p className="text-body-md text-error">Môn học không hợp lệ.</p>
          <Link
            className="mt-3 inline-block text-label-md font-medium text-catalog-cobalt underline"
            to={TEACHER_ROUTES.courses}
          >
            Quay lại danh sách môn
          </Link>
        </div>
      </TeacherPageShell>
    );
  }

  return (
    <TeacherPageShell>
      <CourseStructureManager subjectId={subjectId} />
    </TeacherPageShell>
  );
}
