import { CreateFlashcardPage } from "../features/teacher/flashcard/pages/create-flashcard-page";

export function meta() {
  return [
    { title: "Tạo Flashcard | M-L Master" },
    {
      name: "description",
      content: "Tạo bộ thẻ ghi nhớ mới cho sinh viên.",
    },
  ];
}

export default function TeacherCreateFlashcardRoute() {
  return <CreateFlashcardPage />;
}
