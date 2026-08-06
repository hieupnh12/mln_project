import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherSubjectQuery } from "../../course-structure/hooks/use-course-structure-queries";
import { SubjectDocumentManager } from "../components/subject-document-manager";
import { SubjectDocumentShell } from "../components/subject-document-shell";
import { SUBJECT_DOCUMENT_ROUTES } from "../constants/subject-document.constants";

type SubjectDocumentDetailPageProps = {
  subjectId: number;
};

export function SubjectDocumentDetailPage({ subjectId }: SubjectDocumentDetailPageProps) {
  const subjectQuery = useTeacherSubjectQuery(subjectId);

  if (subjectQuery.isLoading) {
    return (
      <SubjectDocumentShell>
        <div className="rounded-2xl bg-landing-gray/40 p-md text-body-md text-landing-text-soft">
          Đang tải thông tin môn học...
        </div>
      </SubjectDocumentShell>
    );
  }

  if (subjectQuery.isError || !subjectQuery.data) {
    return (
      <SubjectDocumentShell>
        <div className="space-y-4">
          <div className="rounded-2xl border border-error/30 bg-error-container/40 p-gutter">
            <p className="text-body-md font-medium text-error">
              Không tìm thấy môn học hoặc không thể tải dữ liệu.
            </p>
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

  return (
    <SubjectDocumentManager
      subjectCode={subjectQuery.data.code}
      subjectId={subjectId}
      subjectTitle={subjectQuery.data.title}
    />
  );
}
