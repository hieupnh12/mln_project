import { QuizManagementPage } from "../features/teacher/quiz-management/pages/quiz-management-page";

export function meta() {
  return [
    { title: "Quản lý Quiz | Học LLCT" },
    {
      name: "description",
      content: "Tạo quiz từ ngân hàng câu hỏi và publish cho sinh viên.",
    },
  ];
}

export default function TeacherQuizzesRoute() {
  return <QuizManagementPage />;
}
