import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "~/shared/hooks/use-debounced-value";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { ApiRequestError } from "~/shared/services/api-client";

import { useQuestionMetadataQuery } from "../../question-library/hooks/use-question-library-queries";
import type { QuestionItem, QuestionListItem } from "../../question-library/types/question-library.types";
import {
  defaultQuizFilters,
  defaultQuizSettings,
} from "../constants/quiz-management.constants";
import {
  useCloseQuizMutation,
  useDeleteQuizMutation,
  useDuplicateQuizMutation,
  usePublishQuizMutation,
  useSaveQuizMutation,
} from "./use-quiz-management-mutations";
import { useQuizScopeOptions } from "./use-quiz-scope-options";
import {
  useQuizCandidateCountQuery,
  useQuizCandidateQuestionsQuery,
  useQuizDetailQuery,
  useQuizListQuery,
  useQuizStatsQuery,
} from "./use-quiz-management-queries";
import { hasActiveCandidateFilter } from "../utils/quiz-ui.helpers";
import {
  buildSaveQuizPayload,
  getCandidateQuestions,
} from "../services/quiz-management.service";
import type {
  QuizEditorTab,
  QuizFilters,
  QuizListItem,
  QuizManagementView,
  QuizSettings,
} from "../types/quiz-management.types";

export function useQuizManagementController() {
  const [view, setView] = useState<QuizManagementView>("list");
  const [filters, setFilters] = useState<QuizFilters>(defaultQuizFilters);
  const [editorQuizId, setEditorQuizId] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<QuizEditorTab>("settings");
  const [settings, setSettings] = useState<QuizSettings>(defaultQuizSettings);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionItem[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateDifficulty, setCandidateDifficulty] = useState("all");
  const [candidatePage, setCandidatePage] = useState(0);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

  const debouncedCandidateSearch = useDebouncedValue(candidateSearch, 300);
  const hasCandidateFilter = hasActiveCandidateFilter(
    debouncedCandidateSearch,
    candidateDifficulty,
  );
  const hasCandidateFilterUi = hasActiveCandidateFilter(
    candidateSearch,
    candidateDifficulty,
  );

  const metadataQuery = useQuestionMetadataQuery();
  const listQuery = useQuizListQuery(filters);
  const statsQuery = useQuizStatsQuery();
  const detailQuery = useQuizDetailQuery(view === "editor" ? editorQuizId : null);
  const saveMutation = useSaveQuizMutation();
  const publishMutation = usePublishQuizMutation();
  const duplicateMutation = useDuplicateQuizMutation();
  const closeMutation = useCloseQuizMutation();
  const deleteMutation = useDeleteQuizMutation();

  const courseOptions = metadataQuery.data?.courses ?? [];
  const lessonOptions = metadataQuery.data?.lessonOptions ?? [];
  const { chapterOptions, lessonTitles } = useQuizScopeOptions(
    lessonOptions,
    settings.course,
    settings.chapter,
  );

  const candidateCountQuery = useQuizCandidateCountQuery(
    {
      course: settings.course,
      chapter: settings.chapter || "all",
      lesson: settings.lesson,
    },
    view === "editor" && Boolean(settings.course),
  );

  const candidateQuery = useQuizCandidateQuestionsQuery(
    {
      course: settings.course,
      chapter: settings.chapter || "all",
      lesson: settings.lesson,
      search: debouncedCandidateSearch,
      difficulty: candidateDifficulty,
      page: candidatePage,
    },
    view === "editor"
      && Boolean(settings.course)
      && editorTab === "questions"
      && hasCandidateFilter,
  );

  useEffect(() => {
    if (courseOptions.length === 0) return;
    setSettings((current) =>
      current.course
        ? current
        : {
            ...current,
            course: courseOptions[0],
            chapter: "all",
            lesson: "all",
          },
    );
  }, [courseOptions]);

  useEffect(() => {
    if (!detailQuery.data) return;
    setSettings(detailQuery.data.settings);
    setSelectedIds(detailQuery.data.questionIds);
    setSelectedQuestions(detailQuery.data.questions);
    setIsPublished(detailQuery.data.isPublished);
  }, [detailQuery.data]);

  const listItems = listQuery.data?.items ?? [];
  const summary = statsQuery.data ?? {
    total: 0,
    draftCount: 0,
    publishedCount: 0,
    totalQuestions: 0,
    avgDuration: 0,
  };

  const activeQuiz: QuizListItem | null = useMemo(() => {
    if (editorQuizId) {
      return listItems.find((quiz) => quiz.id === editorQuizId) ?? detailQuery.data?.listItem ?? null;
    }
    return null;
  }, [detailQuery.data?.listItem, editorQuizId, listItems]);

  function openCreateQuiz() {
    setEditorQuizId(null);
    setSettings({
      ...defaultQuizSettings,
      title: "Quiz mới",
      course: courseOptions[0] ?? "",
      chapter: "all",
      lesson: "all",
      availableUntil: "",
    });
    setSelectedIds([]);
    setSelectedQuestions([]);
    setIsPublished(false);
    setEditorTab("settings");
    setCandidatePage(0);
    setView("editor");
  }

  function openEditQuiz(quizId: string) {
    setEditorQuizId(quizId);
    setEditorTab("settings");
    setCandidatePage(0);
    setView("editor");
  }

  async function duplicateQuizById(quizId: string) {
    try {
      await runWithAsyncActivity({
        label: "Nhân bản quiz",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(40, "Đang nhân bản...");
          await duplicateMutation.mutateAsync(quizId);
          updateProgress(100, "Hoàn tất");
        },
      });
      showSuccessToast("Đã nhân bản quiz.");
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể nhân bản quiz.");
    }
  }

  function backToList() {
    setView("list");
    setEditorQuizId(null);
  }

  function toQuestionItem(question: QuestionListItem): QuestionItem {
    return {
      ...question,
      answer: "",
      score: 1,
      estimatedTime: 60,
      tags: [],
      options: [],
      updatedBy: "",
    };
  }

  function addQuestion(question: QuestionListItem) {
    const item = toQuestionItem(question);
    setSelectedIds((current) =>
      current.includes(question.id) ? current : [...current, question.id],
    );
    setSelectedQuestions((current) =>
      current.some((entry) => entry.id === question.id) ? current : [...current, item],
    );
    setIsPublished(false);
  }

  function removeQuestion(questionId: string) {
    setSelectedIds((current) => current.filter((id) => id !== questionId));
    setSelectedQuestions((current) => current.filter((item) => item.id !== questionId));
    setIsPublished(false);
  }

  function clearQuestions() {
    setSelectedIds([]);
    setSelectedQuestions([]);
    setIsPublished(false);
  }

  function moveQuestion(fromIndex: number, toIndex: number) {
    setSelectedIds((current) => {
      if (toIndex < 0 || toIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setSelectedQuestions((current) => {
      if (toIndex < 0 || toIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setIsPublished(false);
  }

  async function closeQuizById(quizId: string) {
    if (!window.confirm("Tắt quiz live? Sinh viên sẽ không làm bài được.")) {
      return;
    }
    try {
      await runWithAsyncActivity({
        label: "Tắt quiz",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(50, "Đang tắt...");
          await closeMutation.mutateAsync(quizId);
          updateProgress(100, "Hoàn tất");
        },
      });
      showSuccessToast("Đã tắt quiz.");
      if (editorQuizId === quizId) {
        setIsPublished(false);
        void detailQuery.refetch();
      }
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể tắt quiz.");
    }
  }

  async function deleteQuizById(quizId: string) {
    if (!window.confirm("Xóa bản nháp này? Hành động không hoàn tác.")) {
      return;
    }
    try {
      await runWithAsyncActivity({
        label: "Xóa quiz",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(50, "Đang xóa...");
          await deleteMutation.mutateAsync(quizId);
          updateProgress(100, "Hoàn tất");
        },
      });
      showSuccessToast("Đã xóa quiz.");
      if (editorQuizId === quizId) {
        backToList();
      }
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể xóa quiz.");
    }
  }

  async function generateRandomQuiz() {
    if (!settings.course) {
      showErrorToast("Chọn môn trước khi random.");
      return;
    }

    const poolSize = candidateCountQuery.data ?? 0;
    if (poolSize === 0) {
      showErrorToast("Không có câu hỏi trong phạm vi đã chọn.");
      return;
    }

    setIsGeneratingRandom(true);
    try {
      const picked = await runWithAsyncActivity({
        label: "Random câu hỏi",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(25, "Đang lấy ngân hàng câu...");
          const pool = await getCandidateQuestions({
            course: settings.course,
            chapter: settings.chapter,
            lesson: settings.lesson,
            search: "",
            difficulty: "all",
            page: 0,
            size: Math.min(poolSize, 500),
          });
          updateProgress(70, "Đang chọn ngẫu nhiên...");
          const shuffled = [...pool.items].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, Math.min(settings.randomCount, pool.items.length));
          updateProgress(100, `Đã chọn ${selected.length} câu`);
          return selected;
        },
      });

      setSelectedIds(picked.map((item) => item.id));
      setSelectedQuestions(picked.map(toQuestionItem));
      setIsPublished(false);
      setEditorTab("questions");
      showSuccessToast(`Đã random ${picked.length} câu.`);
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể random câu hỏi.");
    } finally {
      setIsGeneratingRandom(false);
    }
  }

  async function saveDraft() {
    try {
      const payload = buildSaveQuizPayload(settings, selectedIds);
      const result = await runWithAsyncActivity({
        label: "Lưu bản nháp",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(35, "Đang lưu quiz...");
          const saved = await saveMutation.mutateAsync({ id: editorQuizId ?? undefined, payload });
          updateProgress(100, "Đã lưu");
          return saved;
        },
      });
      setEditorQuizId(result.id);
      setIsPublished(result.status === "Đã xuất bản");
      showSuccessToast("Đã lưu bản nháp.");
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể lưu quiz.");
    }
  }

  async function reopenQuizById(quizId: string) {
    try {
      await runWithAsyncActivity({
        label: "Bật lại quiz",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(50, "Đang bật lại...");
          await publishMutation.mutateAsync(quizId);
          updateProgress(100, "Hoàn tất");
        },
      });
      showSuccessToast("Đã bật lại quiz.");
      if (editorQuizId === quizId) {
        setIsPublished(true);
        void detailQuery.refetch();
      }
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể bật lại quiz.");
    }
  }

  async function handlePublish() {
    try {
      let quizId = editorQuizId;
      if (!quizId) {
        const saved = await saveMutation.mutateAsync({
          payload: buildSaveQuizPayload(settings, selectedIds),
        });
        quizId = saved.id;
        setEditorQuizId(saved.id);
      } else {
        await saveMutation.mutateAsync({
          id: quizId,
          payload: buildSaveQuizPayload(settings, selectedIds),
        });
      }

      await runWithAsyncActivity({
        label: "Xuất bản quiz",
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(50, "Đang xuất bản...");
          await publishMutation.mutateAsync(quizId!);
          updateProgress(100, "Đã xuất bản");
        },
      });
      setIsPublished(true);
      showSuccessToast("Đã xuất bản quiz.");
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể xuất bản quiz.");
    }
  }

  function updateSettings(nextSettings: QuizSettings) {
    setSettings(nextSettings);
    setIsPublished(false);
    setCandidatePage(0);
  }

  return {
    view,
    filters,
    setFilters,
    listItems,
    listQuery,
    statsQuery,
    summary,
    openCreateQuiz,
    openEditQuiz,
    duplicateQuizById,
    closeQuizById,
    reopenQuizById,
    deleteQuizById,
    backToList,
    editorQuizId,
    editorTab,
    setEditorTab,
    settings,
    setSettings: updateSettings,
    selectedIds,
    selectedQuestions,
    isPublished,
    activeQuiz,
    isLoadingDetail: detailQuery.isLoading && Boolean(editorQuizId),
    isSaving: saveMutation.isPending || publishMutation.isPending,
    courseOptions,
    chapterOptions,
    lessonOptions: lessonTitles,
    candidateCount: candidateCountQuery.data ?? 0,
    candidateCountLoading: candidateCountQuery.isLoading,
    candidateQuery,
    hasCandidateFilter: hasCandidateFilterUi,
    isCandidateSearchPending:
      candidateSearch.trim().length > 0 && candidateSearch !== debouncedCandidateSearch,
    isGeneratingRandom,
    candidateSearch,
    setCandidateSearch,
    candidateDifficulty,
    setCandidateDifficulty,
    candidatePage,
    setCandidatePage,
    addQuestion,
    removeQuestion,
    clearQuestions,
    moveQuestion,
    generateRandomQuiz,
    saveDraft,
    handlePublish,
  };
}
