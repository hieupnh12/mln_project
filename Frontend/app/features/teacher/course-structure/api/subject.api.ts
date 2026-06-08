import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { COURSE_STRUCTURE_ENDPOINTS } from "../constants/course-structure-api.constants";
import type {
  CreateSubjectPayload,
  SubjectDto,
  UpdateSubjectPayload,
} from "../types/course-structure-api.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function createSubjectApi(payload: CreateSubjectPayload) {
  const response = await apiClient.post<BackendApiResponse<SubjectDto>>(
    COURSE_STRUCTURE_ENDPOINTS.createSubject,
    payload,
  );
  return unwrap(response);
}

export async function updateSubjectApi(subjectId: number, payload: UpdateSubjectPayload) {
  const response = await apiClient.put<BackendApiResponse<SubjectDto>>(
    COURSE_STRUCTURE_ENDPOINTS.updateSubject(subjectId),
    payload,
  );
  return unwrap(response);
}

export async function deleteSubjectApi(subjectId: number) {
  await apiClient.delete(COURSE_STRUCTURE_ENDPOINTS.deleteSubject(subjectId));
}
