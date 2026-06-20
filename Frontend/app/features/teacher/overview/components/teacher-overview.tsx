import { useMemo } from "react";

import { useTeacherSubjectsQuery } from "../../course-structure/hooks/use-course-structure-queries";
import { useTeacherFlashcardSets } from "../../hooks/use-flashcards";
import { useQuestionStatsQuery } from "../../question-library/hooks/use-question-library-queries";
import { useQuizStatsQuery } from "../../quiz-management/hooks/use-quiz-management-queries";
import { useTeacherOverviewQuestionList } from "../hooks/use-teacher-overview-question-list";
import type { ModuleMetricsInput } from "../utils/teacher-overview-metrics";
import { TeacherOverviewFilterBar } from "./teacher-overview-filter-bar";
import { TeacherOverviewQuestionList } from "./teacher-overview-question-list";
import { TeacherOverviewShell } from "./teacher-overview-shell";
import { TeacherOverviewSummaryStrip } from "./teacher-overview-summary-strip";
import { TeacherOverviewTopBar } from "./teacher-overview-top-bar";

export function TeacherOverview() {
  const subjectsQuery = useTeacherSubjectsQuery();
  const flashcardSetsQuery = useTeacherFlashcardSets();
  const questionStatsQuery = useQuestionStatsQuery();
  const quizStatsQuery = useQuizStatsQuery();

  const questionList = useTeacherOverviewQuestionList();

  const totalFlashcards =
    flashcardSetsQuery.data?.reduce((total, set) => total + set.cards, 0) ?? 0;
  const flashcardSetCount = flashcardSetsQuery.data?.length ?? 0;

  const metricsInput = useMemo<ModuleMetricsInput>(
    () => ({
      courseCount: subjectsQuery.data?.length ?? 0,
      flashcardCount: totalFlashcards,
      flashcardSetCount,
      questionStats: questionStatsQuery.data,
      quizStats: quizStatsQuery.data,
    }),
    [
      flashcardSetCount,
      questionStatsQuery.data,
      quizStatsQuery.data,
      subjectsQuery.data,
      totalFlashcards,
    ],
  );

  const isStatsLoading =
    subjectsQuery.isLoading ||
    flashcardSetsQuery.isLoading ||
    questionStatsQuery.isLoading ||
    quizStatsQuery.isLoading;

  const hasStatsError =
    subjectsQuery.isError ||
    flashcardSetsQuery.isError ||
    questionStatsQuery.isError ||
    quizStatsQuery.isError;

  const syncSearch = (value: string) => {
    questionList.setSearch(value);
  };

  return (
    <TeacherOverviewShell>
      <TeacherOverviewTopBar onSearchChange={syncSearch} search={questionList.search} />

      <TeacherOverviewSummaryStrip isLoading={isStatsLoading} metricsInput={metricsInput} />

      <TeacherOverviewFilterBar
        difficulty={questionList.difficulty}
        onDifficultyChange={questionList.setDifficulty}
        onSearchChange={syncSearch}
        onStatusChange={questionList.setStatus}
        search={questionList.search}
        status={questionList.status}
      />

      {hasStatsError ? (
        <div className="mt-4 rounded-2xl border border-error/30 bg-error-container/30 p-sm text-label-md font-medium text-error">
          Không thể tải một phần dữ liệu thống kê. Vui lòng thử lại sau.
        </div>
      ) : null}

      <TeacherOverviewQuestionList
        isError={questionList.questionsQuery.isError}
        isLoading={questionList.questionsQuery.isLoading}
        items={questionList.items}
        onPageChange={questionList.goToPage}
        page={questionList.page}
        totalPages={questionList.totalPages}
      />
    </TeacherOverviewShell>
  );
}
