import { StudentExamReviewPage } from "../features/student/exams/pages/student-exam-review-page";

export function meta() {
  return [{ title: "Xem chi tiết bài làm | ML Learning" }];
}

export default function StudentExamReviewRoute() {
  return <StudentExamReviewPage />;
}
