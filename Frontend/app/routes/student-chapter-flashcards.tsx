import { useParams } from "react-router";

import { ChapterFlashcardsPage } from "~/features/student/flashcards/pages/chapter-flashcards-page";

export function meta() {
  return [{ title: "Thẻ ghi nhớ Chương | M-L Master" }];
}

export default function StudentChapterFlashcardsRoute() {
  const { chapterId } = useParams();
  const numericChapterId = Number(chapterId);

  return <ChapterFlashcardsPage chapterId={numericChapterId} />;
}
