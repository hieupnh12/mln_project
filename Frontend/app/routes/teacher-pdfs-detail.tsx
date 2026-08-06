import { Link, useParams } from "react-router";

import { MaterialIcon } from "../features/teacher/components/teacher-icons";
import { SubjectDocumentDetailPage } from "../features/teacher/subject-document/pages/subject-document-detail-page";
import { SubjectDocumentShell } from "../features/teacher/subject-document/components/subject-document-shell";
import { SUBJECT_DOCUMENT_ROUTES } from "../features/teacher/subject-document/constants/subject-document.constants";

export function meta() {
  return [
    { title: "Tài liệu môn học | Học LLCT" },
    {
      name: "description",
      content: "Quản lý tài liệu tải về theo từng môn học.",
    },
  ];
}

export default function TeacherPdfsDetailRoute() {
  const params = useParams();
  const subjectId = Number(params.subjectId);

  if (!Number.isFinite(subjectId) || subjectId <= 0) {
    return (
      <SubjectDocumentShell>
        <div className="space-y-4">
          <div className="rounded-2xl border border-error/30 bg-error-container/40 p-gutter">
            <p className="text-body-md font-medium text-error">Mã môn học không hợp lệ.</p>
          </div>
          <Link
            className="inline-flex items-center gap-1.5 text-label-md font-medium text-landing-text-soft transition hover:text-landing-text"
            to={SUBJECT_DOCUMENT_ROUTES.list}
          >
            <MaterialIcon className="text-[18px]">arrow_back</MaterialIcon>
            Quay lại danh sách môn
          </Link>
        </div>
      </SubjectDocumentShell>
    );
  }

  return <SubjectDocumentDetailPage subjectId={subjectId} />;
}
