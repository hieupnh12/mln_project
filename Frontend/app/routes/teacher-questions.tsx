import { QuestionLibraryPage } from "../features/teacher/question-library/pages/question-library-page";

export function meta() {
  return [
    { title: "Ngân hàng câu hỏi | M-L Master" },
    {
      name: "description",
      content: "Quản lý và import câu hỏi theo môn, chương, bài.",
    },
  ];
}

export default function TeacherQuestionsRoute() {
  return <QuestionLibraryPage />;
}
