import { Link } from "react-router";

import type { SubjectListItem } from "~/features/student/types/student.types";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";
import { SUBJECT_DOCUMENT_ROUTES } from "../constants/subject-document.constants";

type SubjectDocumentSubjectCardProps = {
  subject: SubjectListItem;
};

export function SubjectDocumentSubjectCard({ subject }: SubjectDocumentSubjectCardProps) {
  return (
    <article
      className={`flex min-h-52 flex-col justify-between rounded-2xl border border-outline-variant/25 bg-landing-white p-gutter transition duration-200 hover:-translate-y-0.5 hover:border-outline-variant/45 ${TEACHER_PORTAL_ROW_SHADOW}`}
    >
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
          <MaterialIcon>folder</MaterialIcon>
        </div>
        <span className="inline-block rounded-full bg-landing-gray px-3 py-1 text-label-sm font-semibold text-landing-text-soft">
          {subject.code}
        </span>
        <h3 className="mt-3 line-clamp-2 text-headline-md font-semibold text-landing-text">
          {subject.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-label-md text-landing-text-soft">
          {subject.description || "Chưa có mô tả"}
        </p>
      </div>

      <Link
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/15 transition hover:bg-landing-red-deep"
        to={SUBJECT_DOCUMENT_ROUTES.detail(subject.id)}
      >
        <MaterialIcon>upload_file</MaterialIcon>
        Quản lý tài liệu
      </Link>
    </article>
  );
}
