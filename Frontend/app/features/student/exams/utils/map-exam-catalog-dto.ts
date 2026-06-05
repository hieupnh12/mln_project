import type { StudentQuizCatalogDto } from "../types/exams-api.types";
import type { ExamCatalog } from "../types/exams.types";

export function mapExamCatalogDto(dto: StudentQuizCatalogDto): ExamCatalog {
  return {
    subjectTitle: dto.subjectTitle ?? "",
    ongoing: dto.ongoing.map((item) => ({ ...item })),
    upcoming: dto.upcoming.map((item) => ({ ...item })),
    completed: dto.completed.map((item) => ({ ...item })),
  };
}
