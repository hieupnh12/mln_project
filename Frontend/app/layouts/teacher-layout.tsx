import { useEffect } from "react";
import { Outlet } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { TeacherMobileNav } from "../features/teacher/components/teacher-mobile-nav";
import { TeacherSidebar } from "../features/teacher/components/teacher-sidebar";
import { getFlashcardSets } from "~/features/teacher/services/flashcard.service";
import {
  getQuestionMetadata,
  getQuestionStats,
} from "~/features/teacher/question-library/services/question-library.service";
import {
  getQuizList,
  getQuizStats,
} from "~/features/teacher/quiz-management/services/quiz-management.service";
import { QUESTION_LIBRARY_QUERY_KEYS } from "~/features/teacher/question-library/constants/question-library.constants";
import {
  QUIZ_MANAGEMENT_QUERY_KEYS,
  defaultQuizFilters,
} from "~/features/teacher/quiz-management/constants/quiz-management.constants";

export function TeacherLayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Prefetch flashcard sets
    queryClient.prefetchQuery({
      queryKey: ["teacher", "flashcard-sets"],
      queryFn: getFlashcardSets,
      staleTime: 5 * 60 * 1000,
    });

    // 2. Prefetch question library metadata
    queryClient.prefetchQuery({
      queryKey: QUESTION_LIBRARY_QUERY_KEYS.metadata,
      queryFn: getQuestionMetadata,
      staleTime: 5 * 60 * 1000,
    });

    // 3. Prefetch question library stats
    queryClient.prefetchQuery({
      queryKey: QUESTION_LIBRARY_QUERY_KEYS.stats,
      queryFn: getQuestionStats,
      staleTime: 5 * 60 * 1000,
    });

    // 4. Prefetch quiz list (default filters)
    queryClient.prefetchQuery({
      queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.list(defaultQuizFilters),
      queryFn: () => getQuizList(defaultQuizFilters),
      staleTime: 5 * 60 * 1000,
    });

    // 5. Prefetch quiz stats
    queryClient.prefetchQuery({
      queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.stats,
      queryFn: getQuizStats,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return (
    <div className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface">
      <TeacherSidebar />

      <main className="px-margin-mobile pb-xl pt-md md:px-margin-desktop lg:ml-64">
        <TeacherMobileNav />
        <Outlet />
      </main>
    </div>
  );
}
