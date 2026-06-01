import { FlashcardPage } from "../features/teacher/flashcard/pages/flashcard-page";

export function meta() {
  return [
    { title: "Flashcard | M-L Master" },
    {
      name: "description",
      content: "Quản lý bộ thẻ ghi nhớ cho sinh viên.",
    },
  ];
}

export default function TeacherFlashcardsRoute() {
  return <FlashcardPage />;
}
