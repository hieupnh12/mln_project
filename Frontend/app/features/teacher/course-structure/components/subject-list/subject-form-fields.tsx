import {
  SUBJECT_DESCRIPTION_MAX_LENGTH,
  type SubjectFormErrors,
  type SubjectFormValues,
} from "../../utils/validate-subject-form";

const fieldClassName =
  "w-full rounded-xl border-0 bg-landing-white px-3 py-2.5 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25";

type SubjectFormFieldsProps = {
  values: SubjectFormValues;
  errors: SubjectFormErrors;
  onChange: (field: keyof SubjectFormValues, value: string) => void;
};

export function SubjectFormFields({ values, errors, onChange }: SubjectFormFieldsProps) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-label-sm font-medium text-landing-text-soft">
          Kí hiệu
        </label>
        <input
          className={`${fieldClassName} font-semibold uppercase tracking-wider`}
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
        <label className="mb-1.5 block text-label-sm font-medium text-landing-text-soft">
          Tên môn học
        </label>
        <input
          className={`${fieldClassName} text-headline-sm font-semibold`}
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
        <label className="mb-1.5 block text-label-sm font-medium text-landing-text-soft">
          Mô tả
        </label>
        <textarea
          className={`${fieldClassName} min-h-[72px] resize-y`}
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
