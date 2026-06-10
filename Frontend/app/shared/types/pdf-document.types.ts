export type PdfDocument = {
  materialId: number;
  lessonId: number;
  title: string;
  resourceUrl: string;
  pageCount: number | null;
  lessonTitle: string | null;
  chapterTitle: string | null;
  subjectTitle: string | null;
};

export type UploadPdfDocumentPayload = {
  lessonId: number;
  title: string;
  file: File;
};
