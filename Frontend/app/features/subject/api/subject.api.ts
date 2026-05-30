import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { SUBJECT_ENDPOINTS } from "../constants/subject.constants";
import type { SubjectResponse } from "../types/subject.types";

export async function fetchAllSubjects() {
  const response = await apiClient.get<BackendApiResponse<SubjectResponse[]>>(
    SUBJECT_ENDPOINTS.all,
  );

  return response.data;
}

export async function fetchSubjectById(id: number) {
  const response = await apiClient.get<BackendApiResponse<SubjectResponse>>(
    SUBJECT_ENDPOINTS.byId(id),
  );

  return response.data;
}
