import { fetchAllSubjects, fetchSubjectById } from "../api/subject.api";
import type { SubjectListItem } from "../types/subject.types";

function mapSubjectResponse(subject: {
  subjectId: number;
  subjectCode: string;
  title: string;
  description: string;
}): SubjectListItem {
  return {
    id: subject.subjectId,
    code: subject.subjectCode,
    title: subject.title,
    description: subject.description,
  };
}

export async function getAllSubjects(): Promise<SubjectListItem[]> {
  const payload = await fetchAllSubjects();
  return (payload.result ?? []).map(mapSubjectResponse);
}

export async function getSubjectById(id: number): Promise<SubjectListItem> {
  const payload = await fetchSubjectById(id);
  return mapSubjectResponse(payload.result);
}
