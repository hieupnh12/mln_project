import { StudentExamSummaryPage } from "../features/student/exams/pages/student-exam-summary-page";

export function meta() {
  return [{ title: "Tổng kết bài kiểm tra | ML Learning" }];
}

export default function StudentExamSummaryRoute() {
  return <StudentExamSummaryPage />;
}
