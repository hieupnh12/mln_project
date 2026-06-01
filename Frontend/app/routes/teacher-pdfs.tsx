import { PdfDocumentPage } from "../features/teacher/pdf-document/pages/pdf-document-page";

export function meta() {
  return [
    { title: "Tài liệu PDF | M-L Master" },
    {
      name: "description",
      content: "Quản lý tài liệu PDF theo chương học.",
    },
  ];
}

export default function TeacherPdfsRoute() {
  return <PdfDocumentPage />;
}
