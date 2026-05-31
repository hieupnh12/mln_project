import { useParams } from "react-router";

import { CourseStructureDetailPage } from "../features/teacher/course-structure/pages/course-structure-detail-page";

export function meta() {
  return [
    { title: "Quản lý môn học | M-L Master" },
    {
      name: "description",
      content: "Quản lý chương, bài học và tài liệu theo môn học.",
    },
  ];
}

export default function TeacherCourseDetailRoute() {
  const { subjectId } = useParams();
  const parsedSubjectId = Number(subjectId);

  return <CourseStructureDetailPage subjectId={parsedSubjectId} />;
}
