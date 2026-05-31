import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { SUBJECT_ENDPOINTS } from "../constants/student-api.constants";
import type { SubjectResponse } from "../types/student.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchAllSubjects() {
  const response = await apiClient.get<BackendApiResponse<SubjectResponse[]>>(
    SUBJECT_ENDPOINTS.all,
  );
  return unwrap(response);
}

export async function fetchSubjectById(id: number) {
  const response = await apiClient.get<BackendApiResponse<SubjectResponse>>(
    SUBJECT_ENDPOINTS.byId(id),
  );
  return unwrap(response);
}
