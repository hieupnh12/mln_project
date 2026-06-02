import { useEffect, useMemo, useState } from "react";

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
  useDuplicateQuizMutation,
  usePublishQuizMutation,
  useSaveQuizMutation,
} from "./use-quiz-management-mutations";
import {
  useQuizCandidateQuestionsQuery,
  useQuizDetailQuery,
  useQuizListQuery,
  useQuizStatsQuery,
} from "./use-quiz-management-queries";
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

  const metadataQuery = useQuestionMetadataQuery();
  const listQuery = useQuizListQuery(filters);
  const statsQuery = useQuizStatsQuery();
  const detailQuery = useQuizDetailQuery(view === "editor" ? editorQuizId : null);
  const saveMutation = useSaveQuizMutation();
  const publishMutation = usePublishQuizMutation();
  const duplicateMutation = useDuplicateQuizMutation();

  const courseOptions = metadataQuery.data?.courses ?? [];
  const chapterOptions = metadataQuery.data?.chapters ?? [];
  const lessonOptions = metadataQuery.data?.lessons ?? [];

  const candidateQuery = useQuizCandidateQuestionsQuery(
    {
      course: settings.course,
      chapter: settings.chapter,
      lesson: settings.lesson,
      search: candidateSearch,
      difficulty: candidateDifficulty,
      page: candidatePage,
    },
    view === "editor" && Boolean(settings.course) && Boolean(settings.chapter),
  );

  useEffect(() => {
    if (courseOptions.length === 0) return;
    setSettings((current) =>
      current.course
        ? current
        : {
            ...current,
            course: courseOptions[0],
            chapter: chapterOptions[0] ?? "",
          },
    );
  }, [chapterOptions, courseOptions]);

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
      chapter: chapterOptions[0] ?? "",
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

  async function generateRandomQuiz() {
    if (!settings.course || !settings.chapter) {
      showErrorToast("Chọn môn và chương trước khi random câu hỏi.");
      return;
    }

    try {
      const pool = await getCandidateQuestions({
        course: settings.course,
        chapter: settings.chapter,
        lesson: settings.lesson,
        search: "",
        difficulty: "all",
        page: 0,
        size: 100,
      });
      const shuffled = [...pool.items].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, settings.randomCount);
      setSelectedIds(picked.map((item) => item.id));
      setSelectedQuestions(picked.map(toQuestionItem));
      setIsPublished(false);
      setEditorTab("questions");
    } catch (error) {
      showErrorToast(error instanceof ApiRequestError ? error.message : "Không thể random câu hỏi.");
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
    lessonOptions,
    candidateQuery,
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
