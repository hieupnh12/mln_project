import { useMemo, useState } from "react";

import {
  chapterOptions,
  courseOptions,
  lessonOptions,
  questionItems,
  quizItems,
} from "../constants/teacher-dashboard.constants";
import type { QuestionItem } from "../types/teacher-dashboard.types";
import {
  NumberInput,
  SelectInput,
  TextInput,
  ToggleInput,
} from "./teacher-form-controls";
import { MaterialIcon } from "./teacher-icons";

type QuizSettings = {
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  randomCount: number;
  shuffleAnswers: boolean;
  randomQuestions: boolean;
};

const defaultSettings: QuizSettings = {
  title: "Quiz chương 1",
  course: courseOptions[0],
  chapter: chapterOptions[0],
  lesson: "all",
  duration: 20,
  passingScore: 70,
  randomCount: 10,
  shuffleAnswers: true,
  randomQuestions: false,
};

export function QuizManagementManager() {
  const [settings, setSettings] = useState<QuizSettings>(defaultSettings);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const candidateQuestions = useMemo(
    () =>
      questionItems.filter(
        (question) =>
          question.course === settings.course &&
          question.chapter === settings.chapter &&
          (settings.lesson === "all" || question.lesson === settings.lesson),
      ),
    [settings],
  );

  const selectedQuestions = selectedIds
    .map((id) => questionItems.find((question) => question.id === id))
    .filter((question): question is QuestionItem => Boolean(question));

  function addQuestion(questionId: string) {
    setSelectedIds((current) =>
      current.includes(questionId) ? current : [...current, questionId],
    );
    setPublished(false);
  }

  function generateRandomQuiz() {
    const nextIds = [...candidateQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.randomCount)
      .map((question) => question.id);
    setSelectedIds(nextIds);
    setPublished(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-md">
      <Header
        draftCount={quizItems.filter((quiz) => quiz.status === "Bản nháp").length}
        published={published}
        total={quizItems.length}
      />
      <section className="grid grid-cols-1 gap-md xl:grid-cols-[360px_minmax(0,1fr)]">
        <QuizSettingsPanel
          candidateCount={candidateQuestions.length}
          onGenerateRandom={generateRandomQuiz}
          onSettingsChange={(nextSettings) => {
            setSettings(nextSettings);
            setPublished(false);
          }}
          selectedCount={selectedQuestions.length}
          settings={settings}
        />
        <div className="space-y-md">
          <QuestionPicker
            onAdd={addQuestion}
            questions={candidateQuestions}
            selectedIds={selectedIds}
          />
          <QuizPreview
            onPublish={() => setPublished(true)}
            onRemove={(id) => {
              setSelectedIds((current) => current.filter((item) => item !== id));
              setPublished(false);
            }}
            questions={selectedQuestions}
            settings={settings}
          />
        </div>
      </section>
    </div>
  );
}

function Header({
  draftCount,
  published,
  total,
}: {
  draftCount: number;
  published: boolean;
  total: number;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">
          Quản lý Quiz
        </h3>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Tạo quiz từ ngân hàng câu hỏi, random câu, trộn đáp án và publish.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-sm rounded-2xl border border-outline-variant/20 bg-white p-sm text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <Metric label="Quiz" value={total} />
        <Metric label="Bản nháp" value={draftCount} />
        <Metric label={published ? "Đã publish" : "Đang soạn"} value={published ? 1 : 0} />
      </div>
    </header>
  );
}

function QuizSettingsPanel({
  candidateCount,
  onGenerateRandom,
  onSettingsChange,
  selectedCount,
  settings,
}: {
  candidateCount: number;
  onGenerateRandom: () => void;
  onSettingsChange: (settings: QuizSettings) => void;
  selectedCount: number;
  settings: QuizSettings;
}) {
  return (
    <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="flex items-center gap-sm text-headline-md font-semibold text-primary">
        <MaterialIcon>tune</MaterialIcon>
        Cài đặt quiz
      </h4>
      <TextInput label="Tên quiz" onChange={(title) => onSettingsChange({ ...settings, title })} value={settings.title} />
      <SelectInput label="Môn" onChange={(course) => onSettingsChange({ ...settings, course })} value={settings.course}>{courseOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Chương" onChange={(chapter) => onSettingsChange({ ...settings, chapter })} value={settings.chapter}>{chapterOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <SelectInput label="Bài" onChange={(lesson) => onSettingsChange({ ...settings, lesson })} value={settings.lesson}><option value="all">Tất cả bài</option>{lessonOptions.map((item) => <option key={item}>{item}</option>)}</SelectInput>
      <NumberInput label="Thời gian (phút)" min={5} onChange={(duration) => onSettingsChange({ ...settings, duration })} value={settings.duration} />
      <NumberInput label="Điểm đạt (%)" min={1} onChange={(passingScore) => onSettingsChange({ ...settings, passingScore })} value={settings.passingScore} />
      <NumberInput label="Số câu random" min={1} onChange={(randomCount) => onSettingsChange({ ...settings, randomCount })} value={settings.randomCount} />
      <ToggleInput label="Trộn đáp án" onChange={(shuffleAnswers) => onSettingsChange({ ...settings, shuffleAnswers })} value={settings.shuffleAnswers} />
      <ToggleInput label="Random khi publish" onChange={(randomQuestions) => onSettingsChange({ ...settings, randomQuestions })} value={settings.randomQuestions} />
      <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container" onClick={onGenerateRandom} type="button"><MaterialIcon>casino</MaterialIcon>Tạo ngẫu nhiên từ {candidateCount} câu</button>
      <div className="grid grid-cols-2 gap-sm text-center"><Metric label="Đã chọn" value={selectedCount} /><Metric label="Nguồn lọc" value={candidateCount} /></div>
    </aside>
  );
}

function QuestionPicker({
  onAdd,
  questions,
  selectedIds,
}: {
  onAdd: (id: string) => void;
  questions: QuestionItem[];
  selectedIds: string[];
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="mb-sm text-headline-md font-semibold text-primary">
        Câu hỏi phù hợp
      </h4>
      <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
        {questions.map((question) => {
          const selected = selectedIds.includes(question.id);
          return (
            <article className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm" key={question.id}>
              <div className="mb-3 flex items-start justify-between gap-sm">
                <div className="min-w-0"><p className="font-semibold text-primary">{question.title}</p><p className="line-clamp-2 text-body-md text-on-surface-variant">{question.question}</p></div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-secondary">{question.id}</span>
              </div>
              <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-white px-sm py-2 text-label-md font-semibold text-primary transition hover:bg-secondary-container disabled:opacity-70" disabled={selected} onClick={() => onAdd(question.id)} type="button"><MaterialIcon>{selected ? "check" : "add"}</MaterialIcon>{selected ? "Đã thêm" : "Thêm vào quiz"}</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function QuizPreview({
  onPublish,
  onRemove,
  questions,
  settings,
}: {
  onPublish: () => void;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
  settings: QuizSettings;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/20 bg-primary-container p-md text-white shadow-[0_12px_32px_rgba(35,39,51,0.12)]">
      <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h4 className="text-headline-md font-semibold">{settings.title}</h4><p className="text-body-md text-secondary-container">{questions.length} câu - {settings.duration} phút - đạt {settings.passingScore}%</p></div>
        <button className="rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container disabled:opacity-60" disabled={questions.length === 0} onClick={onPublish} type="button">Publish quiz</button>
      </div>
      <div className="space-y-sm">
        {questions.map((question, index) => (
          <div className="flex items-center justify-between gap-sm rounded-xl bg-white/10 p-sm" key={question.id}>
            <div className="min-w-0"><p className="font-semibold">Câu {index + 1}: {question.title}</p><p className="line-clamp-1 text-sm text-secondary-container">{question.question}</p></div>
            <button aria-label="Bỏ câu hỏi" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-container hover:bg-white/10" onClick={() => onRemove(question.id)} type="button"><MaterialIcon>close</MaterialIcon></button>
          </div>
        ))}
        {questions.length === 0 && <p className="rounded-xl bg-white/10 p-md text-secondary-container">Chưa có câu hỏi nào trong quiz.</p>}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-surface-container-low p-sm"><strong className="block text-headline-md text-primary">{value}</strong><span className="text-label-sm font-semibold text-on-surface-variant">{label}</span></div>;
}
