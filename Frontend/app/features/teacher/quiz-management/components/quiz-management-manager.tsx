import { useMemo, useState } from "react";

import { questionItems } from "../../question-library/constants/question-library.constants";
import type { QuestionItem } from "../../question-library/types/question-library.types";
import {
  defaultQuizSettings,
  quizItems,
} from "../constants/quiz-management.constants";
import type { QuizSettings } from "../types/quiz-management.types";
import { QuestionPicker } from "./question-picker";
import { Metric } from "./quiz-metric";
import { QuizPreview } from "./quiz-preview";
import { QuizSettingsPanel } from "./quiz-settings-panel";

export function QuizManagementManager() {
  const [settings, setSettings] = useState<QuizSettings>(defaultQuizSettings);
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
        <Metric
          label={published ? "Đã publish" : "Đang soạn"}
          value={published ? 1 : 0}
        />
      </div>
    </header>
  );
}
