import { SubjectDocumentListPage } from "../features/teacher/subject-document/pages/subject-document-list-page";

export function meta() {
  return [
    { title: "Tài liệu học tập | Học LLCT" },
    {
      name: "description",
      content: "Chọn môn học để quản lý giáo trình và tài liệu tải về.",
    },
  ];
}

export default function TeacherPdfsRoute() {
  return <SubjectDocumentListPage />;
}
