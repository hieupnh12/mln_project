export const SUBJECT_DOCUMENT_ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "txt",
  "zip",
  "png",
  "jpg",
  "jpeg",
  "webp",
] as const;

export const SUBJECT_DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg,.webp";

export const SUBJECT_DOCUMENT_ROUTES = {
  list: "/teacher/pdfs",
  detail: (subjectId: number | string) => `/teacher/pdfs/${subjectId}`,
} as const;
