import { useEffect, useMemo, useState } from "react";

import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";

import { createQuiz } from "../../../quiz-management/services/quiz-management.service";
import { MaterialIcon } from "../../../components/teacher-icons";
import {
  createDefaultRandomExamScope,
  defaultExportConfig,
  defaultRandomExamConfig,
} from "../../constants/export-exam.constants";
import type { LessonOptionDto } from "../../types/question-library-api.types";
import type {
  ExportConfig,
  RandomExamConfig,
  RandomExamPreviewItem,
} from "../../types/export-exam.types";
import { toWaygroundExportOptions } from "../../types/export-exam.types";
import type { QuestionItem } from "../../types/question-library.types";
import { buildQuizDraftPayload } from "../../utils/build-quiz-draft-payload";
import { downloadWaygroundExport } from "../../utils/download-wayground-export";
import {
  fetchApprovedQuestionDetails,
  fetchApprovedQuestionSummaries,
} from "../../utils/fetch-export-questions";
import { filterQuestionsByScope, pickRandomQuestions } from "../../utils/random-exam";
import { validateRandomExamConfig } from "../../utils/validate-random-exam-config";
import { ExamPreviewModal } from "./exam-preview-modal";
import { ExportConfigSection } from "./export-config-section";
import { ModalOverlay } from "./modal-overlay";
import { RandomExamConfigSection } from "./random-exam-config-section";

type ExportExamModalProps = {
  open: boolean;
  lessonOptions: LessonOptionDto[];
  onClose: () => void;
};

export function ExportExamModal({ open, lessonOptions, onClose }: ExportExamModalProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig);
  const [randomConfig, setRandomConfig] = useState<RandomExamConfig>(() => ({
    ...defaultRandomExamConfig,
    scope: createDefaultRandomExamScope(lessonOptions),
  }));
  const [candidates, setCandidates] = useState<
    Array<Pick<QuestionItem, "id" | "difficulty" | "chapter" | "lesson" | "course">>
  >([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<RandomExamPreviewItem[]>([]);
  const [pickedQuestions, setPickedQuestions] = useState<QuestionItem[]>([]);
  const [exporting, setExporting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreviewOpen(false);
      return;
    }

    if (lessonOptions.length > 0) {
      setRandomConfig((current) =>
        current.scope.subjectTitle
          ? current
          : { ...current, scope: createDefaultRandomExamScope(lessonOptions) },
      );
    }
  }, [open, lessonOptions]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setLoadingCandidates(true);

    fetchApprovedQuestionSummaries({
      search: "",
      course: "all",
      chapter: "all",
      lesson: "all",
      difficulty: "all",
      type: "all",
      status: "Đã xuất bản",
    })
      .then((items) => {
        if (!cancelled) {
          setCandidates(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCandidates(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    setPickedQuestions([]);
    setPreviewItems([]);
    setPreviewOpen(false);
  }, [randomConfig]);

  const validation = useMemo(
    () => validateRandomExamConfig(randomConfig, candidates, lessonOptions),
    [randomConfig, candidates, lessonOptions],
  );

  function buildPreviewItems(questions: QuestionItem[]): RandomExamPreviewItem[] {
    return questions.map((item) => ({
      id: item.id,
      question: item.question,
      difficulty: item.difficulty,
      chapter: item.chapter,
      lesson: item.lesson,
      score: item.score,
      timeInSeconds: exportConfig.timePerQuestionSeconds,
    }));
  }

  async function generatePickedQuestions(): Promise<QuestionItem[] | null> {
    if (!validation.valid) {
      showErrorToast(validation.errors[0] ?? "Cấu hình đề chưa hợp lệ.");
      return null;
    }

    const scoped = filterQuestionsByScope(candidates, randomConfig.scope, lessonOptions);
    const pickedSummaries = pickRandomQuestions(
      scoped,
      randomConfig.totalCount,
      randomConfig.easyPercent,
      randomConfig.mediumPercent,
    );

    const details = await fetchApprovedQuestionDetails(pickedSummaries.map((item) => item.id));
    setPickedQuestions(details);
    setPreviewItems(buildPreviewItems(details));
    return details;
  }

  async function handlePreview() {
    const details = await generatePickedQuestions();
    if (details && details.length > 0) {
      setPreviewOpen(true);
    }
  }

  async function saveDraftQuiz(questions: QuestionItem[]) {
    const payload = buildQuizDraftPayload(randomConfig, questions, exportConfig);
    await createQuiz(payload);
  }

  async function handleSaveDraft() {
    if (savingDraft || exporting) {
      return;
    }

    setSavingDraft(true);
    try {
      const questions = pickedQuestions.length > 0 ? pickedQuestions : await generatePickedQuestions();
      if (!questions || questions.length === 0) {
        return;
      }

      await runWithAsyncActivity({
        id: "question-library-save-quiz-draft",
        label: "Lưu bản nháp quiz",
        simulateProgress: true,
        task: async () => {
          await saveDraftQuiz(questions);
          showSuccessToast(`Đã lưu quiz bản nháp với ${questions.length} câu hỏi.`);
        },
      });
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể lưu quiz bản nháp.");
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleExportFile() {
    if (exporting || savingDraft) {
      return;
    }

    await runWithAsyncActivity({
      id: "question-library-random-export",
      label: "Xuất đề & lưu quiz bản nháp",
      simulateProgress: true,
      task: async (updateProgress) => {
        setExporting(true);
        try {
          const questions =
            pickedQuestions.length > 0 ? pickedQuestions : await generatePickedQuestions();
          if (!questions || questions.length === 0) {
            return;
          }

          updateProgress(40, `Đang lưu quiz bản nháp (${questions.length} câu)...`);
          await saveDraftQuiz(questions);

          updateProgress(80, "Đang tạo file Excel Wayground...");
          await downloadWaygroundExport(
            questions,
            toWaygroundExportOptions(exportConfig),
            "wayground-de-ngau-nhien",
          );

          setPreviewOpen(false);
          onClose();
          showSuccessToast(
            `Đã xuất ${questions.length} câu sang Wayground và lưu quiz bản nháp.`,
          );
        } finally {
          setExporting(false);
        }
      },
    }).catch((error) => {
      showErrorToast(error instanceof Error ? error.message : "Không thể xuất đề.");
    });
  }

  useEffect(() => {
    if (pickedQuestions.length > 0) {
      setPreviewItems(buildPreviewItems(pickedQuestions));
    }
  }, [exportConfig.timePerQuestionSeconds, exportConfig.columns.explanation, pickedQuestions]);

  return (
    <>
      <ModalOverlay labelledBy="export-exam-title" onClose={onClose} open={open}>
        <div className="custom-scrollbar mx-auto max-h-[calc(100vh-48px)] w-full max-w-[1400px] overflow-y-auto rounded-2xl bg-background p-4 shadow-2xl md:p-md">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-4">
            <div>
              <h2
                className="text-headline-lg font-semibold text-primary"
                id="export-exam-title"
              >
                Cấu hình xuất &amp; đề thi
              </h2>
              <p className="mt-2 text-body-lg text-on-surface-variant">
                Random đề, xem trước, lưu quiz bản nháp hoặc xuất Excel Wayground.
              </p>
            </div>
            <button
              aria-label="Đóng"
              className="shrink-0 rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
              onClick={onClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
            <section className="lg:col-span-5">
              <ExportConfigSection config={exportConfig} onChange={setExportConfig} />
            </section>
            <section className="lg:col-span-7">
              {loadingCandidates ? (
                <p className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-md text-center text-body-md text-on-surface-variant">
                  Đang tải ngân hàng câu hỏi đã duyệt...
                </p>
              ) : (
                <RandomExamConfigSection
                  config={randomConfig}
                  lessonOptions={lessonOptions}
                  onChange={setRandomConfig}
                  onPreview={handlePreview}
                  onSaveDraft={handleSaveDraft}
                  previewDisabled={loadingCandidates}
                  savingDraft={savingDraft}
                  validation={validation}
                />
              )}
            </section>
          </div>
        </div>
      </ModalOverlay>

      <ExamPreviewModal
        exporting={exporting}
        items={previewItems}
        onClose={() => setPreviewOpen(false)}
        onExport={handleExportFile}
        onSaveDraft={handleSaveDraft}
        open={previewOpen}
        savingDraft={savingDraft}
      />
    </>
  );
}
