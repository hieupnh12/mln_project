import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { TeacherMobileNav } from "../features/teacher/components/teacher-mobile-nav";
import { TeacherRoutePending } from "../features/teacher/components/teacher-route-pending";
import { TeacherSidebar } from "../features/teacher/components/teacher-sidebar";
import { useTeacherSidebar } from "../features/teacher/hooks/use-teacher-sidebar";
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
import { isTeacherPath } from "~/shared/constants/route-access";

export function TeacherLayout() {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { collapsed, mainOffsetClass, sidebarWidthClass, toggleCollapsed } =
    useTeacherSidebar();

  const isTeacherRoutePending =
    navigation.state !== "idle"
    && navigation.location != null
    && isTeacherPath(navigation.location.pathname);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["teacher", "flashcard-sets"],
      queryFn: getFlashcardSets,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUESTION_LIBRARY_QUERY_KEYS.metadata,
      queryFn: getQuestionMetadata,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUESTION_LIBRARY_QUERY_KEYS.stats,
      queryFn: getQuestionStats,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.list(defaultQuizFilters),
      queryFn: () => getQuizList(defaultQuizFilters),
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.stats,
      queryFn: getQuizStats,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return (
    <div className="teacher-theme-root min-h-svh overflow-x-hidden bg-landing-gray font-body-md text-landing-text">
      <TeacherSidebar
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        sidebarWidthClass={sidebarWidthClass}
      />

      <main
        className={`px-4 pb-24 pt-4 transition-[margin] duration-200 ease-out md:px-5 lg:px-6 lg:pb-xl ${mainOffsetClass}`}
      >
        {isTeacherRoutePending ? <TeacherRoutePending /> : <Outlet />}
      </main>

      <TeacherMobileNav />
    </div>
  );
}
