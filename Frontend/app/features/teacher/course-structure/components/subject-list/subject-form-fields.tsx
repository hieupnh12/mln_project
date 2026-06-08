import {
  SUBJECT_DESCRIPTION_MAX_LENGTH,
  type SubjectFormErrors,
  type SubjectFormValues,
} from "../../utils/validate-subject-form";

type SubjectFormFieldsProps = {
  values: SubjectFormValues;
  errors: SubjectFormErrors;
  onChange: (field: keyof SubjectFormValues, value: string) => void;
};

export function SubjectFormFields({ values, errors, onChange }: SubjectFormFieldsProps) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Kí hiệu
        </label>
        <input
          className="w-full rounded-[10px] border-[1.5px] border-outline-variant bg-surface-container-low px-3 py-2 font-semibold uppercase tracking-wider text-on-secondary-container text-label-sm outline-none transition focus:border-secondary focus:bg-white focus:shadow-[0_0_0_3px_rgba(191,232,230,0.28)]"
          maxLength={12}
          onChange={(event) => onChange("code", event.target.value)}
          placeholder="VD: MLN111"
          type="text"
          value={values.code}
        />
        {errors.code ? (
          <p className="mt-1 text-label-sm text-error">{errors.code}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Tên môn học
        </label>
        <input
          className="w-full rounded-[10px] border-[1.5px] border-outline-variant bg-surface-container-low px-3 py-2 text-[17px] font-semibold text-primary outline-none transition focus:border-secondary focus:bg-white focus:shadow-[0_0_0_3px_rgba(191,232,230,0.28)]"
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Nhập tên môn học"
          type="text"
          value={values.title}
        />
        {errors.title ? (
          <p className="mt-1 text-label-sm text-error">{errors.title}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Mô tả
        </label>
        <textarea
          className="min-h-[72px] w-full resize-y rounded-[10px] border-[1.5px] border-outline-variant bg-surface-container-low px-3 py-2 text-label-md text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:shadow-[0_0_0_3px_rgba(191,232,230,0.28)]"
          maxLength={SUBJECT_DESCRIPTION_MAX_LENGTH}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Nhập mô tả môn học (tuỳ chọn)"
          rows={3}
          value={values.description}
        />
        {errors.description ? (
          <p className="mt-1 text-label-sm text-error">{errors.description}</p>
        ) : null}
      </div>
    </>
  );
}
