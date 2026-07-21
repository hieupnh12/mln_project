import { StudentCoursePage } from "../features/student/course-learning/pages/student-course-page";

export function meta() {
  return [
    { title: "Khóa học Lý luận chính trị | Học LLCT" },
    {
      name: "description",
      content: "Không gian bài giảng, flashcard, luyện tập và kiểm tra Lý luận chính trị trên Học LLCT.",
    },
  ];
}

export default function StudentCourseRoute() {
  return <StudentCoursePage />;
}
