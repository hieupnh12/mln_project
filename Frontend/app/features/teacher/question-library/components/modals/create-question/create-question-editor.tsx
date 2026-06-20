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
      <label className="flex items-center gap-2 text-label-md font-medium text-landing-text">
        <MaterialIcon className="text-sm">description</MaterialIcon>
        NỘI DUNG CÂU HỎI
      </label>
      <div className="overflow-hidden rounded-xl border border-outline-variant/25 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex items-center gap-1 border-b border-outline-variant/25 bg-landing-gray/35 p-2">
          {editorToolbarActions.slice(0, 3).map((icon) => (
            <button
              aria-label={icon}
              className="rounded p-1 transition hover:bg-landing-gray/60"
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
              className="rounded p-1 transition hover:bg-landing-gray/60"
              key={icon}
              type="button"
            >
              <MaterialIcon className="text-[20px]">{icon}</MaterialIcon>
            </button>
          ))}
        </div>
        <textarea
          className="min-h-[160px] w-full resize-y bg-landing-white p-4 font-body-md text-landing-text focus:outline-none"
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
