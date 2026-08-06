export type SubjectDocument = {
  documentId: number;
  subjectId: number;
  subjectTitle: string | null;
  title: string;
  resourceUrl: string;
  originalFilename: string | null;
  fileExtension: string | null;
  fileSize: number | null;
  createdAt: string | null;
};

export type UploadSubjectDocumentPayload = {
  subjectId: number;
  title: string;
  file: File;
};
