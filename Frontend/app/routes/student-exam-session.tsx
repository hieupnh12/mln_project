import { StudentExamSessionPage } from "../features/student/exams/pages/student-exam-session-page";

export function meta() {
  return [{ title: "Làm bài kiểm tra | Học LLCT" }];
}

export default function StudentExamSessionRoute() {
  return <StudentExamSessionPage />;
}
