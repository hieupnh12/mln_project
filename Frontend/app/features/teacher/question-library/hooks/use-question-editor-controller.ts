import { useEffect, useState } from "react";

import { ApiRequestError } from "~/shared/services/api-client";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";

import { emptyQuestionDraft } from "../constants/question-library.constants";
import {
  useBatchImportMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
} from "../hooks/use-question-library-mutations";
import { checkQuestionDuplicate, getQuestion } from "../services/question-library.service";
import type { ImportPreviewRow } from "../types/import-batch.types";
import type { CreateQuestionPayload, LessonOptionDto } from "../types/question-library-api.types";
import type {
  QuestionDraft,
  QuestionItem,
  QuestionListItem,
  QuestionModalId,
  QuestionStatus,
} from "../types/question-library.types";
import { createQuestionDraftFromLesson } from "../utils/lesson-options";
import { mapImportPreviewRowToPayload } from "../utils/map-import-batch-payload";
import { mapDraftToCreatePayload } from "../utils/map-question-draft";
import { mapQuestionToDraft } from "../utils/map-question-to-draft";

type DuplicateCompareState = {
  pendingPayload: CreateQuestionPayload;
  existingQuestion: QuestionItem;
  isExact: boolean;
  warningMessage?: string;
};

type UseQuestionEditorControllerParams = {
  lessonOptions: LessonOptionDto[];
  pageItems: QuestionListItem[];
  onCloseDetail: () => void;
};

const DUPLICATE_ERROR_CODE = 3004;

function getSuccessMessage(status: QuestionStatus, isEditing: boolean) {
  if (isEditing) {
    return "Đã cập nhật câu hỏi.";
  }
  if (status === "Đã xuất bản") {
    return "Đã tạo câu hỏi thành công.";
  }
  if (status === "Cần duyệt") {
    return "Đã gửi câu hỏi để duyệt.";
  }
  return "Đã lưu bản nháp câu hỏi.";
}

export function useQuestionEditorController({
  lessonOptions,
  pageItems,
  onCloseDetail,
}: UseQuestionEditorControllerParams) {
  const [activeModal, setActiveModal] = useState<QuestionModalId | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQuestionDraft);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionStatus, setEditingQuestionStatus] =
    useState<QuestionStatus | null>(null);
  const [duplicateCompare, setDuplicateCompare] =
    useState<DuplicateCompareState | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const createMutation = useCreateQuestionMutation();
  const updateMutation = useUpdateQuestionMutation();
  const batchImportMutation = useBatchImportMutation();

  useEffect(() => {
    if (activeModal !== "add" || lessonOptions.length === 0) {
      return;
    }
    setDraft((current) =>
      current.lessonId ? current : createQuestionDraftFromLesson(lessonOptions[0]),
    );
  }, [activeModal, lessonOptions]);

  function openModal(modal: QuestionModalId) {
    if (modal === "add") {
      setEditingQuestionId(null);
      setEditingQuestionStatus(null);
      setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    }
    setActiveModal(modal);
  }

  function closeModal() {
    setActiveModal(null);
    setEditingQuestionId(null);
    setEditingQuestionStatus(null);
  }

  function openEditQuestion(question: QuestionItem) {
    if (question.status === "Đã xuất bản") {
      showInfoToast("Câu hỏi đã duyệt không thể chỉnh sửa.");
      return;
    }

    onCloseDetail();
    setEditingQuestionId(question.id);
    setEditingQuestionStatus(question.status);
    setDraft(mapQuestionToDraft(question));
    setActiveModal("add");
  }

  async function handleEditQuestion(id: string) {
    const listItem = pageItems.find((item) => item.id === id);
    if (listItem?.status === "Đã xuất bản") {
      showInfoToast("Câu hỏi đã duyệt không thể chỉnh sửa.");
      return;
    }

    try {
      const question = await getQuestion(id);
      openEditQuestion(question);
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Không thể mở chỉnh sửa câu hỏi.",
      );
    }
  }

  function submitQuestion(payload: CreateQuestionPayload, status: QuestionStatus) {
    const isEditing = editingQuestionId !== null;
    runWithAsyncActivity({
      id: isEditing ? "question-library-update" : "question-library-create",
      label: isEditing
        ? "Đang cập nhật câu hỏi"
        : status === "Đã xuất bản"
          ? "Đang tạo câu hỏi"
          : "Đang lưu câu hỏi",
      simulateProgress: true,
      task: async () => {
        if (isEditing && editingQuestionId) {
          await updateMutation.mutateAsync({ id: editingQuestionId, payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        setDraft(emptyQuestionDraft);
        setEditingQuestionId(null);
        setEditingQuestionStatus(null);
        setDuplicateCompare(null);
        closeModal();
        showSuccessToast(getSuccessMessage(status, isEditing));
      },
    }).catch((error) => {
      if (
        error instanceof ApiRequestError &&
        Number(error.code) === DUPLICATE_ERROR_CODE
      ) {
        showInfoToast("Câu hỏi trùng với câu hỏi đã có trong ngân hàng.");
        return;
      }
      showErrorToast(error instanceof Error ? error.message : "Không thể lưu câu hỏi.");
    });
  }

  async function saveQuestion(status: QuestionStatus, allowSimilarSave = false) {
    if (!draft.question.trim()) {
      showErrorToast("Nội dung câu hỏi không được để trống.");
      return;
    }

    const payload = mapDraftToCreatePayload(draft, status, allowSimilarSave);
    if (!payload) {
      showErrorToast("Vui lòng chọn bài học trước khi lưu.");
      return;
    }

    if (!allowSimilarSave) {
      setCheckingDuplicate(true);
      try {
        const duplicateResult = await checkQuestionDuplicate({
          lessonId: payload.lessonId,
          type: payload.type,
          content: payload.question,
          excludeQuestionId: editingQuestionId
            ? Number(editingQuestionId.replace(/^Q-/i, ""))
            : undefined,
        });

        if (
          (duplicateResult.exactDuplicate || duplicateResult.similarDuplicate) &&
          duplicateResult.matchedQuestion
        ) {
          setDuplicateCompare({
            pendingPayload: payload,
            existingQuestion: duplicateResult.matchedQuestion,
            isExact: duplicateResult.exactDuplicate,
            warningMessage: duplicateResult.warningMessage,
          });
          return;
        }
      } catch (error) {
        showErrorToast(
          error instanceof Error ? error.message : "Không thể kiểm tra trùng lặp.",
        );
        return;
      } finally {
        setCheckingDuplicate(false);
      }
    }

    submitQuestion(payload, status);
  }

  function handleConfirmDuplicateSave() {
    if (!duplicateCompare) {
      return;
    }
    submitQuestion(
      { ...duplicateCompare.pendingPayload, allowSimilarSave: true },
      duplicateCompare.pendingPayload.status as QuestionStatus,
    );
  }

  async function handleImportComplete(
    rows: ImportPreviewRow[],
    defaultLessonId: number,
    targetStatus: "PENDING" | "PUBLISHED",
  ) {
    closeModal();
    const importingPublished = targetStatus === "PUBLISHED";

    try {
      const report = await runWithAsyncActivity({
        id: "question-library-batch-import",
        label: importingPublished
          ? "Import câu hỏi đã duyệt"
          : "Import câu hỏi chờ duyệt",
        detail: `${rows.length} dòng`,
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(25, "Đang gửi dữ liệu lên server...");
          const result = await batchImportMutation.mutateAsync({
            lessonId: defaultLessonId,
            targetStatus,
            rows: rows.map(mapImportPreviewRowToPayload),
          });
          updateProgress(95, `Đã xử lý ${result.savedCount}/${rows.length} dòng`);
          return result;
        },
      });

      showSuccessToast(
        importingPublished
          ? `Import xong: ${report.savedCount} câu đã duyệt, ${report.skippedExactDuplicate} trùng, ${report.markedSimilar} tương tự.`
          : `Import xong: ${report.savedCount} câu đang chờ duyệt, ${report.skippedExactDuplicate} trùng, ${report.markedSimilar} tương tự.`,
      );
    } catch (error) {
      showErrorToast(
        error instanceof ApiRequestError
          ? error.message
          : "Không thể import câu hỏi. Vui lòng thử lại.",
      );
    }
  }

  function handleDiscardDraft() {
    setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    setEditingQuestionId(null);
    setEditingQuestionStatus(null);
    closeModal();
  }

  function resolveSaveStatus(publish: boolean): QuestionStatus {
    if (editingQuestionId && editingQuestionStatus) {
      if (publish) {
        return editingQuestionStatus === "Bản nháp"
          ? "Đã xuất bản"
          : editingQuestionStatus;
      }
      return "Bản nháp";
    }
    return publish ? "Đã xuất bản" : "Bản nháp";
  }

  return {
    activeModal,
    closeModal,
    createMutation,
    draft,
    duplicateCompare,
    editingQuestionId,
    editingQuestionStatus,
    handleConfirmDuplicateSave,
    handleDiscardDraft,
    handleEditQuestion,
    handleImportComplete,
    isSaving: createMutation.isPending || updateMutation.isPending || checkingDuplicate,
    openEditQuestion,
    openModal,
    resolveSaveStatus,
    saveQuestion,
    setActiveModal,
    setDraft,
    setDuplicateCompare,
  };
}
