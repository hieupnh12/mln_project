import { Link } from "react-router";

import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import { CourseStructureManager } from "../components/course-structure-manager";

type CourseStructureDetailPageProps = {
  subjectId: number;
};

export function CourseStructureDetailPage({ subjectId }: CourseStructureDetailPageProps) {
  if (Number.isNaN(subjectId)) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-error/30 bg-error-container/30 p-gutter text-center">
        <p className="text-body-md text-error">Môn học không hợp lệ.</p>
        <Link className="mt-3 inline-block text-label-md font-medium text-primary underline" to={TEACHER_ROUTES.courses}>
          Quay lại danh sách môn
        </Link>
      </div>
    );
  }

  return <CourseStructureManager subjectId={subjectId} />;
}
