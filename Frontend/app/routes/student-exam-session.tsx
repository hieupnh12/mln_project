import { StudentExamSessionPage } from "../features/student/exams/pages/student-exam-session-page";

export function meta() {
  return [{ title: "Làm bài kiểm tra | ML Learning" }];
}

export default function StudentExamSessionRoute() {
  return <StudentExamSessionPage />;
}
