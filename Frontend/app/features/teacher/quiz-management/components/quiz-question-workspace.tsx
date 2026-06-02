import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem, QuestionListItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";
import { QuestionPicker } from "./question-picker";
import { QuizSelectedList } from "./quiz-selected-list";

type QuizQuestionWorkspaceProps = {
  candidateCount: number;
  candidateLoading: boolean;
  candidatePage: number;
  candidateQuestions: QuestionListItem[];
  candidateTotal: number;
  onAdd: (question: QuestionListItem) => void;
  onCandidatePageChange: (page: number) => void;
  onClearAll: () => void;
  onDifficultyFilterChange: (value: string) => void;
  onGenerateRandom: () => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onSearchChange: (value: string) => void;
  pageSize: number;
  randomCount: number;
  scopeLabel: QuizSettings;
  search: string;
  selectedIds: string[];
  selectedQuestions: QuestionItem[];
  difficultyFilter: string;
};

export function QuizQuestionWorkspace({
  candidateCount,
  candidateLoading,
  candidatePage,
  candidateQuestions,
  candidateTotal,
  onAdd,
  onCandidatePageChange,
  onClearAll,
  onDifficultyFilterChange,
  onGenerateRandom,
  onRemove,
  onMove,
  onSearchChange,
  pageSize,
  randomCount,
  scopeLabel,
  search,
  selectedIds,
  selectedQuestions,
  difficultyFilter,
}: QuizQuestionWorkspaceProps) {
  const scope = formatQuizScope(
    scopeLabel.course,
    scopeLabel.chapter,
    scopeLabel.lesson,
  );
  const totalPages = Math.max(1, Math.ceil(candidateTotal / pageSize));
  const safePage = Math.min(candidatePage + 1, totalPages);

  return (
    <div className="space-y-md">
      <div className="flex flex-col gap-sm rounded-xl border border-outline-variant/20 bg-white px-md py-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-body-md text-on-surface-variant">
          <MaterialIcon className="text-secondary">filter_alt</MaterialIcon>
          Phạm vi: <span className="font-medium text-primary">{scope}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {candidatePage > 0 ? (
            <PagerButton label="Trang trước" onClick={() => onCandidatePageChange(candidatePage - 1)} />
          ) : null}
          {candidatePage + 1 < totalPages ? (
            <PagerButton label="Trang sau" onClick={() => onCandidatePageChange(candidatePage + 1)} />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <QuestionPicker
          candidateCount={candidateCount}
          difficultyFilter={difficultyFilter}
          isLoading={candidateLoading}
          onAdd={onAdd}
          onDifficultyFilterChange={onDifficultyFilterChange}
          onGenerateRandom={onGenerateRandom}
          onSearchChange={onSearchChange}
          page={safePage}
          pageSize={pageSize}
          questions={candidateQuestions}
          randomCount={randomCount}
          search={search}
          selectedIds={selectedIds}
          totalFiltered={candidateTotal}
        />
        <QuizSelectedList
          onClearAll={onClearAll}
          onMove={onMove}
          onRemove={onRemove}
          questions={selectedQuestions}
        />
      </div>
    </div>
  );
}

function PagerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-1 text-label-sm font-medium text-primary"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
