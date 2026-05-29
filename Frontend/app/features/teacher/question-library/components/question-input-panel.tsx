import { SelectInput, TextInput } from "../../components/teacher-form-controls";
import { MaterialIcon } from "../../components/teacher-icons";
import {
  chapterOptions,
  courseOptions,
  difficultyOptions,
  lessonOptions,
  questionTypeOptions,
} from "../constants/question-library.constants";
import type {
  Difficulty,
  QuestionDraft,
  QuestionMode,
  QuestionType,
} from "../types/question-library.types";

type QuestionInputPanelProps = {
  batchText: string;
  draft: QuestionDraft;
  mode: QuestionMode;
  onBatchTextChange: (value: string) => void;
  onDraftChange: (draft: QuestionDraft) => void;
  onImportBatch: () => void;
  onModeChange: (mode: QuestionMode) => void;
  onSubmitSingle: () => void;
};

export function QuestionInputPanel(props: QuestionInputPanelProps) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-headline-md font-semibold text-primary">
          Nhập câu hỏi
        </h4>
        <ModeSwitch mode={props.mode} onChange={props.onModeChange} />
      </div>
      {props.mode === "single" ? (
        <SingleForm {...props} />
      ) : (
        <BatchForm {...props} />
      )}
    </section>
  );
}

function SingleForm({
  draft,
  onDraftChange,
  onSubmitSingle,
}: Pick<
  QuestionInputPanelProps,
  "draft" | "onDraftChange" | "onSubmitSingle"
>) {
  return (
    <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
      <TextInput
        label="Tiêu đề"
        onChange={(title) => onDraftChange({ ...draft, title })}
        value={draft.title}
      />
      <SelectInput
        label="Loại câu"
        onChange={(type) =>
          onDraftChange({ ...draft, type: type as QuestionType })
        }
        value={draft.type}
      >
        {questionTypeOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <textarea
        className="min-h-28 rounded-lg border-outline-variant bg-surface-container-low md:col-span-2"
        onChange={(event) =>
          onDraftChange({ ...draft, question: event.target.value })
        }
        placeholder="Nội dung câu hỏi"
        value={draft.question}
      />
      <SelectInput
        label="Môn"
        onChange={(course) => onDraftChange({ ...draft, course })}
        value={draft.course}
      >
        {courseOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Chương"
        onChange={(chapter) => onDraftChange({ ...draft, chapter })}
        value={draft.chapter}
      >
        {chapterOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Bài"
        onChange={(lesson) => onDraftChange({ ...draft, lesson })}
        value={draft.lesson}
      >
        {lessonOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Độ khó"
        onChange={(difficulty) =>
          onDraftChange({ ...draft, difficulty: difficulty as Difficulty })
        }
        value={draft.difficulty}
      >
        {difficultyOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <textarea
        className="min-h-24 rounded-lg border-outline-variant bg-surface-container-low md:col-span-2"
        onChange={(event) =>
          onDraftChange({ ...draft, answer: event.target.value })
        }
        placeholder="Đáp án đúng hoặc giải thích"
        value={draft.answer}
      />
      <button
        className="flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-white md:col-span-2"
        onClick={onSubmitSingle}
        type="button"
      >
        <MaterialIcon>add_circle</MaterialIcon>
        Thêm vào ngân hàng
      </button>
    </div>
  );
}

function BatchForm({
  batchText,
  onBatchTextChange,
  onImportBatch,
}: Pick<
  QuestionInputPanelProps,
  "batchText" | "onBatchTextChange" | "onImportBatch"
>) {
  return (
    <div className="space-y-sm">
      <p className="text-body-md text-on-surface-variant">
        Mỗi câu cách nhau bằng một dòng trống. Hỗ trợ Q, A, Course, Chapter,
        Lesson, Difficulty, Type.
      </p>
      <textarea
        className="min-h-72 w-full rounded-xl border-outline-variant bg-surface-container-low font-mono text-sm"
        onChange={(event) => onBatchTextChange(event.target.value)}
        value={batchText}
      />
      <button
        className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container sm:w-auto"
        onClick={onImportBatch}
        type="button"
      >
        <MaterialIcon>upload_file</MaterialIcon>
        Import batch
      </button>
    </div>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: QuestionMode;
  onChange: (mode: QuestionMode) => void;
}) {
  return (
    <div className="flex rounded-xl bg-surface-container-low p-1">
      {(["single", "batch"] as const).map((item) => (
        <button
          className={
            mode === item
              ? "rounded-lg bg-white px-4 py-2 text-label-md font-semibold text-primary shadow-sm"
              : "px-4 py-2 text-label-md font-medium text-on-surface-variant"
          }
          key={item}
          onClick={() => onChange(item)}
          type="button"
        >
          {item === "single" ? "Từng câu" : "Batch"}
        </button>
      ))}
    </div>
  );
}
