export const SUBJECT_DESCRIPTION_MAX_LENGTH = 500;

export type SubjectFormValues = {
  code: string;
  title: string;
  description: string;
};

export type SubjectFormErrors = Partial<Record<keyof SubjectFormValues, string>>;

export function validateSubjectForm(values: SubjectFormValues): SubjectFormErrors {
  const errors: SubjectFormErrors = {};
  const code = values.code.trim();
  const title = values.title.trim();

  if (!code) {
    errors.code = "Vui lòng nhập kí hiệu môn học.";
  } else if (code.length > 12) {
    errors.code = "Kí hiệu tối đa 12 ký tự.";
  }

  if (!title) {
    errors.title = "Vui lòng nhập tên môn học.";
  }

  if (values.description.trim().length > SUBJECT_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Mô tả tối đa ${SUBJECT_DESCRIPTION_MAX_LENGTH} ký tự.`;
  }

  return errors;
}

export function hasFormErrors(errors: SubjectFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
