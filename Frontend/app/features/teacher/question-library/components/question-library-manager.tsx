import { useMemo, useState } from "react";

import {
  courseOptions,
  chapterOptions,
  emptyQuestionDraft,
  lessonOptions,
  questionItems,
  sampleQuestionBatch,
} from "../constants/question-library.constants";
import type {
  Difficulty,
  QuestionDraft,
  QuestionFilters,
  QuestionItem,
  QuestionMode,
  QuestionType,
} from "../types/question-library.types";
import { QuestionFilterPanel } from "./question-filter-panel";
import { QuestionInputPanel } from "./question-input-panel";
import { QuestionTable } from "./question-table";

export function QuestionLibraryManager() {
  const [questions, setQuestions] = useState<QuestionItem[]>(questionItems);
  const [mode, setMode] = useState<QuestionMode>("single");
  const [batchText, setBatchText] = useState(sampleQuestionBatch);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQuestionDraft);
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
    setDraft(emptyQuestionDraft);
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
        <QuestionFilterPanel filters={filters} onChange={setFilters} />
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20">
      <strong className="block text-headline-md text-primary">{value}</strong>
      <span className="text-label-sm font-semibold text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

function isVisible(question: QuestionItem, filters: QuestionFilters) {
  const keyword = filters.search.trim().toLowerCase();
  const text =
    `${question.title} ${question.question} ${question.tags.join(" ")}`.toLowerCase();

  return (
    (!keyword || text.includes(keyword)) &&
    matches(filters.course, question.course) &&
    matches(filters.chapter, question.chapter) &&
    matches(filters.lesson, question.lesson) &&
    matches(filters.difficulty, question.difficulty) &&
    matches(filters.status, question.status)
  );
}

function matches<T extends string>(filterValue: T | "all", value: T) {
  return filterValue === "all" || filterValue === value;
}

function createQuestion(draft: QuestionDraft, index: number): QuestionItem {
  return {
    ...draft,
    id: `Q${String(index + 1).padStart(3, "0")}`,
    status: "Bản nháp",
    tags: ["manual"],
  };
}

function parseBatchQuestion(block: string, index: number): QuestionItem | null {
  const get = (key: string) =>
    block.match(new RegExp(`^${key}:\\s*(.+)$`, "im"))?.[1]?.trim();
  const title = get("Q");

  if (!title) return null;

  return createQuestion(
    {
      ...emptyQuestionDraft,
      title,
      question: title,
      answer: get("A") ?? "",
      course: get("Course") ?? courseOptions[0],
      chapter: get("Chapter") ?? chapterOptions[0],
      lesson: get("Lesson") ?? lessonOptions[0],
      difficulty: (get("Difficulty") as Difficulty | undefined) ?? "Cơ bản",
      type: (get("Type") as QuestionType | undefined) ?? "Trắc nghiệm",
    },
    index,
  );
}
