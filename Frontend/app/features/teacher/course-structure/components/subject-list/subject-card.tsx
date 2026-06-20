import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { SubjectListItem } from "~/features/student/types/student.types";

import { MaterialIcon } from "../../../components/teacher-icons";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../../constants/teacher-ui.constants";
import { TEACHER_ROUTES } from "../../../constants/teacher-dashboard.constants";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";
import {
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} from "../../hooks/use-teacher-subject-mutations";
import {
  hasFormErrors,
  validateSubjectForm,
  type SubjectFormErrors,
  type SubjectFormValues,
} from "../../utils/validate-subject-form";
import { SubjectFormFields } from "./subject-form-fields";

type SubjectCardProps = {
  subject: SubjectListItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

function toFormValues(subject: SubjectListItem): SubjectFormValues {
  return {
    code: subject.code,
    title: subject.title,
    description: subject.description,
  };
}

export function SubjectCard({
  subject,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: SubjectCardProps) {
  const updateMutation = useUpdateSubjectMutation();
  const deleteMutation = useDeleteSubjectMutation();

  const [formValues, setFormValues] = useState<SubjectFormValues>(() => toFormValues(subject));
  const [formErrors, setFormErrors] = useState<SubjectFormErrors>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setFormValues(toFormValues(subject));
      setFormErrors({});
    }
  }, [isEditing, subject]);

  const handleFieldChange = (field: keyof SubjectFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    const errors = validateSubjectForm(formValues);
    if (hasFormErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        subjectId: subject.id,
        payload: {
          subjectCode: formValues.code.trim().toUpperCase(),
          title: formValues.title.trim(),
          description: formValues.description.trim(),
        },
      });
      onCancelEdit();
    } catch {
      // Toast handled in mutation hook.
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(subject.id);
      setDeleteModalOpen(false);
      onCancelEdit();
    } catch {
      // Toast handled in mutation hook.
    }
  };

  const cardClassName = [
    "group flex min-h-52 flex-col justify-between rounded-2xl border p-gutter transition duration-200",
    isEditing
      ? "border-primary/25 bg-landing-white ring-1 ring-primary/15"
      : `border-outline-variant/25 bg-landing-white hover:-translate-y-0.5 hover:border-outline-variant/45 ${TEACHER_PORTAL_ROW_SHADOW}`,
  ].join(" ");

  return (
    <>
      <div className={cardClassName}>
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <SubjectFormFields
              errors={formErrors}
              onChange={handleFieldChange}
              values={formValues}
            />

            <div className="flex items-center gap-2 pt-0.5">
              <button
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-xl bg-error-container text-error transition hover:opacity-90 active:scale-95"
                onClick={() => setDeleteModalOpen(true)}
                title="Xóa"
                type="button"
              >
                <MaterialIcon className="text-[17px]">delete</MaterialIcon>
              </button>
              <button
                className="flex h-[34px] items-center justify-center rounded-xl border border-outline-variant/40 bg-landing-white px-3.5 text-[13px] font-medium text-landing-text-soft transition hover:bg-landing-gray/60 active:scale-[0.96]"
                onClick={onCancelEdit}
                type="button"
              >
                Hủy
              </button>
              <button
                className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-xl bg-landing-red px-3.5 text-[13px] font-semibold text-on-primary transition hover:bg-landing-red-deep active:scale-[0.96] disabled:opacity-60"
                disabled={updateMutation.isPending}
                onClick={() => void handleSave()}
                type="button"
              >
                <MaterialIcon className="text-[16px]">check</MaterialIcon>
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
                  <MaterialIcon>menu_book</MaterialIcon>
                </div>
                <button
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-gray/40 text-landing-text-soft transition hover:bg-landing-gray/70 hover:text-landing-text active:scale-95"
                  onClick={onStartEdit}
                  title="Chỉnh sửa"
                  type="button"
                >
                  <MaterialIcon className="text-[17px]">edit</MaterialIcon>
                </button>
              </div>

              <span className="inline-block rounded-full bg-landing-gray px-3 py-1 text-label-sm font-semibold text-landing-text-soft">
                {subject.code}
              </span>
              <h4 className="mt-3 line-clamp-2 text-headline-md font-semibold text-landing-text">
                {subject.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-label-md text-landing-text-soft">
                {subject.description || "Chưa có mô tả"}
              </p>
            </div>

            <Link
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/15 transition hover:bg-landing-red-deep"
              to={`${TEACHER_ROUTES.courses}/${subject.id}`}
            >
              <MaterialIcon>account_tree</MaterialIcon>
              Quản lý cấu trúc
            </Link>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        confirmLabel="Xóa môn học"
        description={`Bạn có chắc muốn xóa môn "${subject.title}"? Hành động này không thể hoàn tác.`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => void handleDelete()}
        open={deleteModalOpen}
        title="Xóa môn học"
      />
    </>
  );
}
