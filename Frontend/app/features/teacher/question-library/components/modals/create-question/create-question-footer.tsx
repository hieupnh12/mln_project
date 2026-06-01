import { MaterialIcon } from "../../../../components/teacher-icons";

type CreateQuestionFooterProps = {
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving?: boolean;
};

export function CreateQuestionFooter({
  onDiscard,
  onSaveDraft,
  onPublish,
  saving = false,
}: CreateQuestionFooterProps) {
  return (
    <footer className="sticky bottom-0 z-10 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low px-md py-4">
      <button
        className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container-high"
        onClick={onDiscard}
        type="button"
      >
        <MaterialIcon>delete</MaterialIcon>
        Hủy bản nháp
      </button>
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg border border-secondary px-6 py-2.5 text-label-md font-medium text-secondary transition hover:bg-secondary/5 disabled:opacity-50"
          disabled={saving}
          onClick={onSaveDraft}
          type="button"
        >
          Lưu nháp
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-label-md font-medium text-on-primary shadow-lg transition active:scale-95 hover:opacity-90 disabled:opacity-50"
          disabled={saving}
          onClick={onPublish}
          type="button"
        >
          <MaterialIcon>publish</MaterialIcon>
          Xuất bản câu hỏi
        </button>
      </div>
    </footer>
  );
}
