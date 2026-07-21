import { CourseStructurePage } from "../features/teacher/course-structure/pages/course-structure-page";

export function meta() {
  return [
    { title: "Cấu trúc khóa học | Học LLCT" },
    {
      name: "description",
      content: "Quản lý chương và bài học trong cổng giáo viên.",
    },
  ];
}

export default function TeacherCoursesRoute() {
  return <CourseStructurePage />;
}
