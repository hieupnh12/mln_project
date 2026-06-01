import { MaterialIcon } from "../../../../components/teacher-icons";
import { editorToolbarActions } from "../../../constants/create-question.constants";
import type { QuestionDraft } from "../../../types/question-library.types";

type CreateQuestionEditorProps = {
  draft: QuestionDraft;
  onChange: (draft: QuestionDraft) => void;
};

export function CreateQuestionEditor({ draft, onChange }: CreateQuestionEditorProps) {
  return (
    <div className="space-y-sm">
      <label className="flex items-center gap-2 text-label-md font-medium text-on-surface">
        <MaterialIcon className="text-sm">description</MaterialIcon>
        NỘI DUNG CÂU HỎI
      </label>
      <div className="overflow-hidden rounded-lg border border-outline-variant transition-colors focus-within:border-secondary">
        <div className="flex items-center gap-1 border-b border-outline-variant/50 bg-surface-container p-2">
          {editorToolbarActions.slice(0, 3).map((icon) => (
            <button
              aria-label={icon}
              className="rounded p-1 transition hover:bg-surface-variant"
              key={icon}
              type="button"
            >
              <MaterialIcon className="text-[20px]">{icon}</MaterialIcon>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-outline-variant" />
          {editorToolbarActions.slice(3).map((icon) => (
            <button
              aria-label={icon}
              className="rounded p-1 transition hover:bg-surface-variant"
              key={icon}
              type="button"
            >
              <MaterialIcon className="text-[20px]">{icon}</MaterialIcon>
            </button>
          ))}
        </div>
        <textarea
          className="min-h-[160px] w-full resize-y bg-white p-4 font-body-md focus:outline-none"
          onChange={(e) =>
            onChange({
              ...draft,
              question: e.target.value,
              title: e.target.value,
            })
          }
          placeholder="Nhập câu hỏi học thuật tại đây. Hỗ trợ LaTeX và Markdown..."
          value={draft.question}
        />
      </div>
    </div>
  );
}
