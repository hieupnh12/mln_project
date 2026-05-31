import { fetchAllSubjects, fetchSubjectById } from "../api/student.api";
import type { SubjectListItem, SubjectResponse } from "../types/student.types";

function mapSubjectDto(dto: SubjectResponse): SubjectListItem {
  return {
    id: dto.subjectId,
    code: dto.subjectCode,
    title: dto.title,
    description: dto.description ?? "",
  };
}

export async function getAllSubjects(): Promise<SubjectListItem[]> {
  const subjects = await fetchAllSubjects();
  return subjects.map(mapSubjectDto);
}

export async function getSubjectById(id: number): Promise<SubjectListItem> {
  const subject = await fetchSubjectById(id);
  return mapSubjectDto(subject);
}
