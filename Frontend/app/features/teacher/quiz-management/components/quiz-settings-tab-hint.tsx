import { MaterialIcon } from "../../components/teacher-icons";

export function QuizSettingsSectionHint() {
  return (
    <p className="mb-md flex items-start gap-2 rounded-lg bg-secondary-container/30 px-md py-sm text-body-md text-on-surface-variant">
      <MaterialIcon className="shrink-0 text-secondary">info</MaterialIcon>
      Thay đổi môn/chương sẽ lọc lại ngân hàng câu hỏi ở tab tiếp theo. Câu đã chọn ngoài phạm vi
      vẫn được giữ.
    </p>
  );
}
