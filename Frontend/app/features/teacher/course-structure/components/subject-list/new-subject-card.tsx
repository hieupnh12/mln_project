import { useState } from "react";

import { MaterialIcon } from "../../../components/teacher-icons";
import { useCreateSubjectMutation } from "../../hooks/use-teacher-subject-mutations";
import {
  hasFormErrors,
  validateSubjectForm,
  type SubjectFormErrors,
  type SubjectFormValues,
} from "../../utils/validate-subject-form";
import { SubjectFormFields } from "./subject-form-fields";

const EMPTY_VALUES: SubjectFormValues = {
  code: "",
  title: "",
  description: "",
};

type NewSubjectCardProps = {
  onCancel: () => void;
  onCreated: () => void;
};

export function NewSubjectCard({ onCancel, onCreated }: NewSubjectCardProps) {
  const createMutation = useCreateSubjectMutation();
  const [formValues, setFormValues] = useState<SubjectFormValues>(EMPTY_VALUES);
  const [formErrors, setFormErrors] = useState<SubjectFormErrors>({});

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

  const handleCreate = async () => {
    const errors = validateSubjectForm(formValues);
    if (hasFormErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    try {
      await createMutation.mutateAsync({
        subjectCode: formValues.code.trim().toUpperCase(),
        title: formValues.title.trim(),
        description: formValues.description.trim(),
      });
      onCreated();
    } catch {
      // Toast handled in mutation hook.
    }
  };

  return (
    <div className="flex min-h-52 flex-col gap-3 rounded-2xl border border-dashed border-outline-variant/45 bg-landing-gray/25 p-gutter">
      <div className="mb-0.5 flex items-center gap-1.5">
        <MaterialIcon className="text-[17px] text-catalog-cobalt">add_circle</MaterialIcon>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-landing-text-soft">
          Môn học mới
        </span>
      </div>

      <SubjectFormFields errors={formErrors} onChange={handleFieldChange} values={formValues} />

      <div className="flex items-center gap-2 pt-0.5">
        <button
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-outline-variant/40 bg-landing-white text-landing-text-soft transition hover:bg-landing-gray/60 active:scale-[0.96]"
          onClick={onCancel}
          title="Hủy"
          type="button"
        >
          <MaterialIcon className="text-[18px]">close</MaterialIcon>
        </button>
        <button
          className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-xl bg-landing-red px-3.5 text-[13px] font-semibold text-on-primary shadow-md shadow-landing-red/15 transition hover:bg-landing-red-deep active:scale-[0.96] disabled:opacity-60"
          disabled={createMutation.isPending}
          onClick={() => void handleCreate()}
          type="button"
        >
          <MaterialIcon className="text-[16px]">add</MaterialIcon>
          Thêm môn học
        </button>
      </div>
    </div>
  );
}
