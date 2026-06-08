import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { SubjectListItem } from "~/features/student/types/student.types";

import { MaterialIcon } from "../../../components/teacher-icons";
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
    "group flex min-h-40 flex-col justify-between rounded-2xl border p-gutter transition duration-200",
    isEditing
      ? "border-secondary-fixed-dim bg-white shadow-[0_0_0_3px_rgba(191,232,230,0.22),0_4px_16px_rgba(35,39,51,0.06)]"
      : "border-outline-variant/20 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(35,39,51,0.08)]",
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
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container transition hover:bg-[#ffb4ab] active:scale-95"
                onClick={() => setDeleteModalOpen(true)}
                title="Xóa"
                type="button"
              >
                <MaterialIcon className="text-[17px]">delete</MaterialIcon>
              </button>
              <button
                className="flex h-[34px] items-center justify-center rounded-full bg-surface-container px-3.5 text-[13px] font-medium text-on-surface-variant transition hover:bg-surface-container-high active:scale-[0.96]"
                onClick={onCancelEdit}
                type="button"
              >
                Hủy
              </button>
              <button
                className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-full bg-primary-container px-3.5 text-[13px] font-medium text-on-primary transition hover:bg-[#3a3f52] active:scale-[0.96] disabled:opacity-60"
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
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
                    {subject.code}
                  </span>
                  <h4 className="mt-4 text-headline-md font-semibold text-primary group-hover:text-secondary">
                    {subject.title}
                  </h4>
                </div>
                <button
                  className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition hover:bg-secondary-container hover:text-secondary active:scale-95"
                  onClick={onStartEdit}
                  title="Chỉnh sửa"
                  type="button"
                >
                  <MaterialIcon className="text-[17px]">edit</MaterialIcon>
                </button>
              </div>
              <p className="mt-2 line-clamp-2 text-label-md text-on-surface-variant">
                {subject.description || "Chưa có mô tả"}
              </p>
            </div>

            <Link
              className="mt-4 inline-flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary"
              to={`${TEACHER_ROUTES.courses}/${subject.id}`}
            >
              Quản lý cấu trúc
              <MaterialIcon>arrow_forward</MaterialIcon>
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
