import { MaterialIcon } from "../../../../components/teacher-icons";
import { optionLabels } from "../../../constants/create-question.constants";
import type { QuestionDraft } from "../../../types/question-library.types";

type CreateQuestionOptionsProps = {
  draft: QuestionDraft;
  onChange: (draft: QuestionDraft) => void;
};

export function CreateQuestionOptions({ draft, onChange }: CreateQuestionOptionsProps) {
  if (draft.type !== "Trắc nghiệm") return null;

  return (
    <>
      <div className="space-y-sm">
        <label className="flex flex-col items-start gap-1 text-label-md font-medium text-on-surface sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <MaterialIcon className="text-sm">checklist</MaterialIcon>
            PHƯƠNG ÁN &amp; ĐÁP ÁN
          </span>
          <span className="text-on-surface-variant/70">
            Chọn radio cho đáp án đúng
          </span>
        </label>
        <div className="space-y-3">
          {optionLabels.map((label, index) => {
            const selected = draft.correctOptionIndex === index;
            return (
              <div
                className={
                  selected
                    ? "group flex items-center gap-3 rounded-lg border border-secondary-container bg-secondary-container/10 p-3 transition-all duration-200"
                    : "group flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 transition-all duration-200 hover:border-secondary-container"
                }
                key={label}
              >
                <input
                  checked={selected}
                  className="h-5 w-5 border-outline text-secondary focus:ring-secondary/20"
                  name="correct_answer"
                  onChange={() =>
                    onChange({
                      ...draft,
                      correctOptionIndex: index,
                      answer: draft.options[index] ?? "",
                    })
                  }
                  type="radio"
                />
                <span className="w-4 font-bold text-on-surface-variant">{label}</span>
                <input
                  className="min-w-0 flex-1 border-none bg-transparent p-0 font-body-md focus:ring-0"
                  onChange={(e) => {
                    const options = [...draft.options];
                    options[index] = e.target.value;
                    onChange({
                      ...draft,
                      options,
                      answer:
                        draft.correctOptionIndex === index
                          ? e.target.value
                          : draft.answer,
                    });
                  }}
                  placeholder="Nhập nội dung phương án..."
                  type="text"
                  value={draft.options[index] ?? ""}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-sm">
        <label className="flex items-center gap-2 text-label-md font-medium text-on-surface">
          <MaterialIcon className="text-sm">lightbulb</MaterialIcon>
          GIẢI THÍCH ĐÁP ÁN
        </label>
        <textarea
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-4 font-body-md transition-all focus:border-secondary focus:bg-white focus:outline-none"
          onChange={(e) => onChange({ ...draft, explanation: e.target.value })}
          placeholder="Giải thích vì sao đáp án được chọn là đúng..."
          rows={3}
          value={draft.explanation}
        />
      </div>
    </>
  );
}
