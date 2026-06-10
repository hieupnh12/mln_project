import { apiClient } from "./api-client";
import type { BackendApiResponse } from "../types/api.types";
import type {
  PdfDocument,
  UploadPdfDocumentPayload,
} from "../types/pdf-document.types";

const PDF_DOCUMENTS_ENDPOINT = "/materials/pdfs";
const MATERIAL_UPLOAD_TIMEOUT_MS = 120_000;

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function getPdfDocuments(): Promise<PdfDocument[]> {
  const response = await apiClient.get<BackendApiResponse<PdfDocument[]>>(
    PDF_DOCUMENTS_ENDPOINT,
  );
  return unwrap(response);
}

export async function uploadPdfDocument(payload: UploadPdfDocumentPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("files", payload.file);

  const response = await apiClient.post(
    `/materials/lesson/${payload.lessonId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: MATERIAL_UPLOAD_TIMEOUT_MS,
    },
  );

  return response.data;
}

export async function deletePdfDocument(materialId: number) {
  await apiClient.delete(`/materials/${materialId}`);
}
