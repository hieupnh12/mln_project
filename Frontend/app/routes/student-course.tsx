import { StudentCoursePage } from "../features/student/course-learning/pages/student-course-page";

export function meta() {
  return [
    { title: "Triết học Mác - Lênin | ML Learning" },
    {
      name: "description",
      content: "Không gian học tập môn Triết học Mác - Lênin.",
    },
  ];
}

export default function StudentCourseRoute() {
  return <StudentCoursePage />;
}
