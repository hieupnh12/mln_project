import { apiClient } from "./api-client";
import type { BackendApiResponse } from "../types/api.types";
import type {
  SubjectDocument,
  UploadSubjectDocumentPayload,
} from "../types/subject-document.types";

const SUBJECT_DOCUMENTS_ENDPOINT = "/subject-documents";
const UPLOAD_TIMEOUT_MS = 120_000;

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function getSubjectDocuments(): Promise<SubjectDocument[]> {
  const response = await apiClient.get<BackendApiResponse<SubjectDocument[]>>(
    SUBJECT_DOCUMENTS_ENDPOINT,
  );
  return unwrap(response);
}

export async function getSubjectDocumentsBySubject(
  subjectId: number,
): Promise<SubjectDocument[]> {
  const response = await apiClient.get<BackendApiResponse<SubjectDocument[]>>(
    `${SUBJECT_DOCUMENTS_ENDPOINT}/subject/${subjectId}`,
  );
  return unwrap(response);
}

export async function uploadSubjectDocument(payload: UploadSubjectDocumentPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);

  const response = await apiClient.post<BackendApiResponse<SubjectDocument>>(
    `${SUBJECT_DOCUMENTS_ENDPOINT}/subject/${payload.subjectId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: UPLOAD_TIMEOUT_MS,
    },
  );

  return unwrap(response);
}

export async function deleteSubjectDocument(documentId: number) {
  await apiClient.delete(`${SUBJECT_DOCUMENTS_ENDPOINT}/${documentId}`);
}
