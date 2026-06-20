import { MaterialIcon } from "../../../../components/teacher-icons";
import { optionLabels } from "../../../constants/create-question.constants";
import { questionTypeOptions } from "../../../constants/question-library.constants";
import type { QuestionDraft, QuestionType } from "../../../types/question-library.types";
import { formatCorrectAnswerFromIndices } from "../../../utils/resolve-correct-option-indices";

type CreateQuestionOptionsProps = {
  draft: QuestionDraft;
  onChange: (draft: QuestionDraft) => void;
};

function isOptionBasedType(type: QuestionType) {
  return type === "Trắc nghiệm" || type === "Nhiều đáp án";
}

function syncAnswer(draft: QuestionDraft, indices: number[]): QuestionDraft {
  const trimmedOptions = draft.options.map((option) => option.trim());
  return {
    ...draft,
    correctOptionIndices: indices,
    answer: formatCorrectAnswerFromIndices(trimmedOptions, indices),
  };
}

export function CreateQuestionOptions({ draft, onChange }: CreateQuestionOptionsProps) {
  const correctIndices = draft.correctOptionIndices ?? [];
  const isMultiple = draft.type === "Nhiều đáp án";
  const showOptions = isOptionBasedType(draft.type);

  function handleTypeChange(nextType: QuestionType) {
    if (!isOptionBasedType(nextType)) {
      onChange({
        ...draft,
        type: nextType,
        correctOptionIndices: [],
        answer: "",
      });
      return;
    }

    onChange(
      syncAnswer(
        {
          ...draft,
          type: nextType,
        },
        nextType === "Trắc nghiệm"
          ? correctIndices.slice(0, 1)
          : correctIndices,
      ),
    );
  }

  function handleSingleSelect(index: number) {
    onChange(syncAnswer(draft, [index]));
  }

  function handleMultipleToggle(index: number) {
    const selected = correctIndices.includes(index);
    const nextIndices = selected
      ? correctIndices.filter((item) => item !== index)
      : [...correctIndices, index].sort((a, b) => a - b);
    onChange(syncAnswer(draft, nextIndices));
  }

  function handleOptionTextChange(index: number, value: string) {
    const options = [...draft.options];
    options[index] = value;
    onChange(syncAnswer({ ...draft, options }, correctIndices));
  }

  return (
    <>
      <div className="space-y-xs">
        <label className="flex items-center gap-2 text-label-md font-medium text-landing-text">
          <MaterialIcon className="text-sm">category</MaterialIcon>
          LOẠI CÂU HỎI
        </label>
        <select
          className="w-full rounded-xl border-0 bg-landing-white px-4 py-3 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 focus:ring-primary/25"
          onChange={(event) => handleTypeChange(event.target.value as QuestionType)}
          value={draft.type}
        >
          {questionTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {showOptions ? (
        <div className="space-y-sm">
          <label className="flex flex-col items-start gap-1 text-label-md font-medium text-landing-text sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <MaterialIcon className="text-sm">checklist</MaterialIcon>
              PHƯƠNG ÁN &amp; ĐÁP ÁN
            </span>
            <span className="text-landing-text-soft">
              {isMultiple ? "Chọn checkbox cho các đáp án đúng" : "Chọn radio cho đáp án đúng"}
            </span>
          </label>
          <div className="space-y-3">
            {optionLabels.map((label, index) => {
              const selected = correctIndices.includes(index);
              return (
                <div
                  className={
                    selected
                      ? "group flex items-center gap-3 rounded-xl border border-catalog-cobalt/25 bg-catalog-cyan/10 p-3 transition-all duration-200"
                      : "group flex items-center gap-3 rounded-xl border border-outline-variant/25 bg-landing-gray/25 p-3 transition-all duration-200 hover:border-outline-variant/45"
                  }
                  key={label}
                >
                  <input
                    checked={selected}
                    className="h-5 w-5 border-outline text-primary focus:ring-primary/20"
                    name={isMultiple ? `correct_answer_${index}` : "correct_answer"}
                    onChange={() =>
                      isMultiple ? handleMultipleToggle(index) : handleSingleSelect(index)
                    }
                    type={isMultiple ? "checkbox" : "radio"}
                  />
                  <span className="w-4 font-bold text-landing-text-soft">{label}</span>
                  <input
                    className="min-w-0 flex-1 border-none bg-transparent p-0 font-body-md focus:ring-0"
                    onChange={(event) => handleOptionTextChange(index, event.target.value)}
                    placeholder="Nhập nội dung phương án..."
                    type="text"
                    value={draft.options[index] ?? ""}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {showOptions ? (
        <div className="space-y-sm">
          <label className="flex items-center gap-2 text-label-md font-medium text-landing-text">
            <MaterialIcon className="text-sm">lightbulb</MaterialIcon>
            GIẢI THÍCH ĐÁP ÁN
          </label>
          <textarea
            className="w-full rounded-xl border-0 bg-landing-gray/25 p-4 font-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition focus:bg-landing-white focus:ring-primary/25"
            onChange={(event) => onChange({ ...draft, explanation: event.target.value })}
            placeholder="Giải thích vì sao đáp án được chọn là đúng..."
            rows={3}
            value={draft.explanation}
          />
        </div>
      ) : null}
    </>
  );
}
