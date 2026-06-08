import { MaterialIcon } from "../../components/teacher-icons";

export function QuizSettingsSectionHint() {
  return (
    <p className="flex items-center gap-2 rounded-lg border border-secondary-container/50 bg-secondary-container/20 px-sm py-2 text-label-sm text-on-surface-variant">
      <MaterialIcon className="shrink-0 text-[16px] text-secondary">info</MaterialIcon>
      <span>
        Thay đổi môn/chương sẽ lọc lại ngân hàng câu hỏi ở tab tiếp theo. Câu đã chọn ngoài phạm vi
        vẫn được giữ.
      </span>
    </p>
  );
}
