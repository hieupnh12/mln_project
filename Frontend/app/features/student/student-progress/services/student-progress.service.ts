import {
  fetchSubjectLessonProgressApi,
  updateLessonProgressApi,
} from "../api/student-progress.api";
import type {
  StudentLessonProgress,
  StudentProgressStatus,
} from "../types/student-progress.types";

function mapLessonProgress(dto: {
  studentId: number;
  lessonId: number;
  chapterId: number;
  lessonTitle: string;
  status: StudentProgressStatus;
}): StudentLessonProgress {
  return {
    studentId: dto.studentId,
    lessonId: dto.lessonId,
    chapterId: dto.chapterId,
    lessonTitle: dto.lessonTitle,
    status: dto.status,
  };
}

export async function getSubjectLessonProgress(
  subjectId: number,
): Promise<StudentLessonProgress[]> {
  const items = await fetchSubjectLessonProgressApi(subjectId);
  return items.map(mapLessonProgress);
}

export function updateLessonProgress(lessonId: number, status: StudentProgressStatus) {
  return updateLessonProgressApi(lessonId, { status }).then(mapLessonProgress);
}
