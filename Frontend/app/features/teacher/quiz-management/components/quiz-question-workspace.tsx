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
  hasActiveFilter: boolean;
  isCandidateSearchPending: boolean;
  isGeneratingRandom: boolean;
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
  hasActiveFilter,
  isCandidateSearchPending,
  isGeneratingRandom,
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
    <div className="space-y-gutter">
      <div className="rounded-lg bg-surface-container-low px-gutter py-3 text-label-md text-on-surface-variant">
        <MaterialIcon className="mr-1 align-middle text-[18px] text-secondary">filter_alt</MaterialIcon>
        Phạm vi quiz: <span className="font-medium text-primary">{scope}</span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-gutter xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] xl:max-h-[min(70vh,560px)]">
        <QuestionPicker
          candidateCount={candidateCount}
          difficultyFilter={difficultyFilter}
          hasActiveFilter={hasActiveFilter}
          isCandidateSearchPending={isCandidateSearchPending}
          isGeneratingRandom={isGeneratingRandom}
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

      {hasActiveFilter && candidateTotal > pageSize ? (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <PagerButton
            disabled={candidatePage <= 0}
            label="Trang trước"
            onClick={() => onCandidatePageChange(candidatePage - 1)}
          />
          <PagerButton
            disabled={candidatePage + 1 >= totalPages}
            label="Trang sau"
            onClick={() => onCandidatePageChange(candidatePage + 1)}
          />
        </div>
      ) : null}
    </div>
  );
}

function PagerButton({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-lg border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
