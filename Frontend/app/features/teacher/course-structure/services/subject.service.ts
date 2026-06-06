import type { SubjectListItem } from "~/features/student/types/student.types";

import {
  createSubjectApi,
  deleteSubjectApi,
  updateSubjectApi,
} from "../api/subject.api";
import type {
  CreateSubjectPayload,
  SubjectDto,
  UpdateSubjectPayload,
} from "../types/course-structure-api.types";

function mapSubjectDto(dto: SubjectDto): SubjectListItem {
  return {
    id: dto.subjectId,
    code: dto.subjectCode,
    title: dto.title,
    description: dto.description ?? "",
  };
}

export async function createSubject(payload: CreateSubjectPayload): Promise<SubjectListItem> {
  const subject = await createSubjectApi(payload);
  return mapSubjectDto(subject);
}

export async function updateSubject(
  subjectId: number,
  payload: UpdateSubjectPayload,
): Promise<SubjectListItem> {
  const subject = await updateSubjectApi(subjectId, payload);
  return mapSubjectDto(subject);
}

export function deleteSubject(subjectId: number) {
  return deleteSubjectApi(subjectId);
}
