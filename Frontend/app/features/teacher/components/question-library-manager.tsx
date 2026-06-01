import { useMemo, useState } from "react";

import {
  chapterOptions,
  courseOptions,
  difficultyOptions,
  lessonOptions,
  questionItems,
  questionStatusOptions,
  questionTypeOptions,
} from "../constants/teacher-dashboard.constants";
import type {
  Difficulty,
  QuestionItem,
  QuestionStatus,
  QuestionType,
} from "../types/teacher-dashboard.types";
import { SelectInput, TextInput } from "./teacher-form-controls";
import { MaterialIcon } from "./teacher-icons";

type QuestionMode = "single" | "batch";
type QuestionFilters = {
  search: string;
  course: string;
  chapter: string;
  lesson: string;
  difficulty: Difficulty | "all";
  status: QuestionStatus | "all";
};

type QuestionDraft = Omit<QuestionItem, "id" | "status" | "tags">;

const emptyDraft: QuestionDraft = {
  title: "",
  question: "",
  type: "Trắc nghiệm",
  difficulty: "Cơ bản",
  course: courseOptions[0],
  chapter: chapterOptions[0],
  lesson: lessonOptions[0],
  answer: "",
  score: 1,
  estimatedTime: 60,
  options: ["", "", "", ""],
};

const sampleBatch = `Q: Chủ nghĩa duy vật biện chứng nghiên cứu điều gì?
A: Những quy luật chung nhất của tự nhiên, xã hội và tư duy
Course: Triết học Mác - Lênin
Chapter: Chương 2
Lesson: Bài 2.1
Difficulty: Cơ bản
Type: Trắc nghiệm`;

export function QuestionLibraryManager() {
  const [questions, setQuestions] = useState<QuestionItem[]>(questionItems);
  const [mode, setMode] = useState<QuestionMode>("single");
  const [batchText, setBatchText] = useState(sampleBatch);
  const [draft, setDraft] = useState<QuestionDraft>(emptyDraft);
  const [filters, setFilters] = useState<QuestionFilters>({
    search: "",
    course: "all",
    chapter: "all",
    lesson: "all",
    difficulty: "all",
    status: "all",
  });

  const filteredQuestions = useMemo(
    () => questions.filter((question) => isVisible(question, filters)),
    [filters, questions],
  );

  function addSingleQuestion() {
    if (!draft.title.trim() || !draft.question.trim()) return;
    setQuestions((current) => [createQuestion(draft, current.length), ...current]);
    setDraft(emptyDraft);
  }

  function importBatch() {
    const parsed = batchText
      .split(/\n\s*\n/)
      .map((block, index) => parseBatchQuestion(block, questions.length + index))
      .filter((question): question is QuestionItem => Boolean(question));
    setQuestions((current) => [...parsed, ...current]);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-md">
      <Header total={questions.length} visible={filteredQuestions.length} />
      <section className="grid grid-cols-1 gap-md xl:grid-cols-[320px_minmax(0,1fr)]">
        <FilterPanel filters={filters} onChange={setFilters} />
        <div className="space-y-md">
          <QuestionTable questions={filteredQuestions} />
          <QuestionInputPanel
            batchText={batchText}
            draft={draft}
            mode={mode}
            onBatchTextChange={setBatchText}
            onDraftChange={setDraft}
            onImportBatch={importBatch}
            onModeChange={setMode}
            onSubmitSingle={addSingleQuestion}
          />
        </div>
      </section>
    </div>
  );
}

function Header({ total, visible }: { total: number; visible: number }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">
          Ngân hàng câu hỏi
        </h3>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Xem câu hỏi theo môn, chương, bài; nhập từng câu hoặc import batch.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-sm rounded-2xl border border-outline-variant/20 bg-white p-sm text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <Metric label="Tổng câu" value={total} />
        <Metric label="Đang lọc" value={visible} />
      </div>
    </header>
  );
}

function FilterPanel({
  filters,
  onChange,
}: {
  filters: QuestionFilters;
  onChange: (filters: QuestionFilters) => void;
}) {
  return (
    <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="flex items-center gap-sm text-headline-md font-semibold text-primary">
        <MaterialIcon>filter_alt</MaterialIcon>
        Bộ lọc
      </h4>
      <TextInput label="Tìm kiếm" onChange={(search) => onChange({ ...filters, search })} value={filters.search} />
      <SelectInput label="Môn" onChange={(course) => onChange({ ...filters, course })} value={filters.course}><option value="all">Tất cả môn</option>{courseOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Chương" onChange={(chapter) => onChange({ ...filters, chapter })} value={filters.chapter}><option value="all">Tất cả chương</option>{chapterOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Bài" onChange={(lesson) => onChange({ ...filters, lesson })} value={filters.lesson}><option value="all">Tất cả bài</option>{lessonOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Độ khó" onChange={(difficulty) => onChange({ ...filters, difficulty: difficulty as Difficulty | "all" })} value={filters.difficulty}><option value="all">Tất cả độ khó</option>{difficultyOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Trạng thái" onChange={(status) => onChange({ ...filters, status: status as QuestionStatus | "all" })} value={filters.status}><option value="all">Tất cả trạng thái</option>{questionStatusOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
    </aside>
  );
}

function QuestionTable({ questions }: { questions: QuestionItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="hidden grid-cols-[90px_minmax(0,1fr)_150px_120px_120px] gap-4 border-b border-outline-variant/20 bg-surface-container-low px-md py-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant md:grid">
        <span>Mã</span><span>Câu hỏi</span><span>Vị trí</span><span>Độ khó</span><span>Thao tác</span>
      </div>
      <div className="divide-y divide-outline-variant/20">
        {questions.map((question) => (
          <article className="grid gap-3 px-md py-md md:grid-cols-[90px_minmax(0,1fr)_150px_120px_120px] md:items-center" key={question.id}>
            <span className="text-label-md font-semibold text-secondary">{question.id}</span>
            <div className="min-w-0"><p className="font-semibold text-primary">{question.title}</p><p className="line-clamp-2 text-body-md text-on-surface-variant">{question.question}</p></div>
            <span className="text-label-sm font-semibold text-on-surface-variant">{question.chapter} / {question.lesson}</span>
            <span className="w-fit rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">{question.difficulty}</span>
            <div className="flex gap-2"><IconButton icon="visibility" label="Xem" /><IconButton icon="edit" label="Sửa" /><IconButton icon="content_copy" label="Nhân bản" /></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuestionInputPanel(props: {
  batchText: string;
  draft: QuestionDraft;
  mode: QuestionMode;
  onBatchTextChange: (value: string) => void;
  onDraftChange: (draft: QuestionDraft) => void;
  onImportBatch: () => void;
  onModeChange: (mode: QuestionMode) => void;
  onSubmitSingle: () => void;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h4 className="text-headline-md font-semibold text-primary">Nhập câu hỏi</h4><ModeSwitch mode={props.mode} onChange={props.onModeChange} /></div>
      {props.mode === "single" ? <SingleForm {...props} /> : <BatchForm {...props} />}
    </section>
  );
}

function SingleForm({ draft, onDraftChange, onSubmitSingle }: Pick<Parameters<typeof QuestionInputPanel>[0], "draft" | "onDraftChange" | "onSubmitSingle">) {
  return (
    <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
      <TextInput label="Tiêu đề" onChange={(title) => onDraftChange({ ...draft, title })} value={draft.title} />
      <SelectInput label="Loại câu" onChange={(type) => onDraftChange({ ...draft, type: type as QuestionType })} value={draft.type}>{questionTypeOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <textarea className="min-h-28 rounded-lg border-outline-variant bg-surface-container-low md:col-span-2" onChange={(event) => onDraftChange({ ...draft, question: event.target.value })} placeholder="Nội dung câu hỏi" value={draft.question} />
      <SelectInput label="Môn" onChange={(course) => onDraftChange({ ...draft, course })} value={draft.course}>{courseOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Chương" onChange={(chapter) => onDraftChange({ ...draft, chapter })} value={draft.chapter}>{chapterOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Bài" onChange={(lesson) => onDraftChange({ ...draft, lesson })} value={draft.lesson}>{lessonOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Độ khó" onChange={(difficulty) => onDraftChange({ ...draft, difficulty: difficulty as Difficulty })} value={draft.difficulty}>{difficultyOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <textarea className="min-h-24 rounded-lg border-outline-variant bg-surface-container-low md:col-span-2" onChange={(event) => onDraftChange({ ...draft, answer: event.target.value })} placeholder="Đáp án đúng hoặc giải thích" value={draft.answer} />
      <button className="flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-white md:col-span-2" onClick={onSubmitSingle} type="button"><MaterialIcon>add_circle</MaterialIcon>Thêm vào ngân hàng</button>
    </div>
  );
}

function BatchForm({ batchText, onBatchTextChange, onImportBatch }: Pick<Parameters<typeof QuestionInputPanel>[0], "batchText" | "onBatchTextChange" | "onImportBatch">) {
  return <div className="space-y-sm"><p className="text-body-md text-on-surface-variant">Mỗi câu cách nhau bằng một dòng trống. Hỗ trợ Q, A, Course, Chapter, Lesson, Difficulty, Type.</p><textarea className="min-h-72 w-full rounded-xl border-outline-variant bg-surface-container-low font-mono text-sm" onChange={(event) => onBatchTextChange(event.target.value)} value={batchText} /><button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container sm:w-auto" onClick={onImportBatch} type="button"><MaterialIcon>upload_file</MaterialIcon>Import batch</button></div>;
}

function ModeSwitch({ mode, onChange }: { mode: QuestionMode; onChange: (mode: QuestionMode) => void }) {
  return <div className="flex rounded-xl bg-surface-container-low p-1">{(["single", "batch"] as const).map((item) => <button className={mode === item ? "rounded-lg bg-white px-4 py-2 text-label-md font-semibold text-primary shadow-sm" : "px-4 py-2 text-label-md font-medium text-on-surface-variant"} key={item} onClick={() => onChange(item)} type="button">{item === "single" ? "Từng câu" : "Batch"}</button>)}</div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="min-w-20"><strong className="block text-headline-md text-primary">{value}</strong><span className="text-label-sm font-semibold text-on-surface-variant">{label}</span></div>;
}

function IconButton({ icon, label }: { icon: string; label: string }) {
  return <button aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container hover:text-primary" title={label} type="button"><MaterialIcon className="text-[20px]">{icon}</MaterialIcon></button>;
}

function isVisible(question: QuestionItem, filters: QuestionFilters) {
  const keyword = filters.search.trim().toLowerCase();
  const text = `${question.title} ${question.question} ${question.tags.join(" ")}`.toLowerCase();
  return (!keyword || text.includes(keyword)) && matches(filters.course, question.course) && matches(filters.chapter, question.chapter) && matches(filters.lesson, question.lesson) && matches(filters.difficulty, question.difficulty) && matches(filters.status, question.status);
}

function matches<T extends string>(filterValue: T | "all", value: T) {
  return filterValue === "all" || filterValue === value;
}

function createQuestion(draft: QuestionDraft, index: number): QuestionItem {
  return { ...draft, id: `Q${String(index + 1).padStart(3, "0")}`, status: "Bản nháp", tags: ["manual"] };
}

function parseBatchQuestion(block: string, index: number): QuestionItem | null {
  const get = (key: string) => block.match(new RegExp(`^${key}:\\s*(.+)$`, "im"))?.[1]?.trim();
  const title = get("Q");
  if (!title) return null;
  return createQuestion({ ...emptyDraft, title, question: title, answer: get("A") ?? "", course: get("Course") ?? courseOptions[0], chapter: get("Chapter") ?? chapterOptions[0], lesson: get("Lesson") ?? lessonOptions[0], difficulty: (get("Difficulty") as Difficulty | undefined) ?? "Cơ bản", type: (get("Type") as QuestionType | undefined) ?? "Trắc nghiệm" }, index);
}
