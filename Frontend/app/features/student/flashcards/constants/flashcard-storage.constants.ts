export function getFlashcardMasteredStorageKey(studentId: string, chapterId: number) {
  return `mln_flashcards_mastered_${studentId}_chapter_${chapterId}`;
}

export function getFlashcardIndexStorageKey(studentId: string, chapterId: number) {
  return `mln_flashcards_current_index_${studentId}_chapter_${chapterId}`;
}
