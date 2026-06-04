export type PracticeQuestionDto = {
  id: string;
  subjectId: number | null;
  chapterId: number | null;
  lessonId: number | null;
  title: string;
  question: string;
  type: string;
  difficulty: string;
  status: string;
  course: string;
  chapter: string;
  lesson: string;
  answer: string;
  explanation: string | null;
  options: string[] | null;
  correctOptionIndices: number[] | null;
};
