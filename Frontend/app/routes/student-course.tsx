import { StudentCoursePage } from "../features/student/course-learning/pages/student-course-page";

export function meta() {
  return [
    { title: "Khóa học Mác - Lê Nin | M-L Learning" },
    {
      name: "description",
      content: "Không gian bài giảng, flashcard, luyện tập và kiểm tra Mác - Lê Nin.",
    },
  ];
}

export default function StudentCourseRoute() {
  return <StudentCoursePage />;
}
