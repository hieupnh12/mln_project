import { useCallback, useState } from "react";

import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast } from "~/shared/utils/toast";

import type { LessonOptionDto } from "../types/question-library-api.types";
import type { ImportBatchStep, ImportFieldMapping, ImportPreviewRow } from "../types/import-batch.types";
import { buildImportColumnMappings, countMatchedColumns } from "../utils/build-import-column-mappings";
import { buildImportPreviewFromFileWithHeaders, mapParsedRowsToPreview } from "../utils/map-import-preview-rows";
import { countImportLessonIssues } from "../utils/resolve-import-lesson";

type UseImportBatchOptions = {
  lessonOptions: LessonOptionDto[];
  defaultLessonId: number | null;
};

export function useImportBatch({ lessonOptions, defaultLessonId: initialLessonId }: UseImportBatchOptions) {
  const [step, setStep] = useState<ImportBatchStep>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] = useState<ImportFieldMapping[]>([]);
  const [matchedColumnCount, setMatchedColumnCount] = useState(0);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [defaultLessonId, setDefaultLessonId] = useState<number | null>(initialLessonId);

  const refreshPreviewLessons = useCallback(
    (rows: ImportPreviewRow[], lessonId: number | null) =>
      mapParsedRowsToPreview(
        rows.map((row) => ({
          content: row.content,
          type: row.typeLabel || row.type,
          difficulty: row.difficulty,
          tags: row.tags,
          subject: row.subject ?? "",
          chapter: row.chapter ?? "",
          lesson: row.lesson ?? "",
          optionA: row.options?.[0] ?? "",
          optionB: row.options?.[1] ?? "",
          optionC: row.options?.[2] ?? "",
          optionD: row.options?.[3] ?? "",
          correctAnswer: row.answer ?? "",
          explanation: row.explanation ?? "",
        })),
        lessonOptions,
        lessonId,
      ),
    [lessonOptions],
  );

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }

      setIsParsingFile(true);
      try {
        const parsed = await runWithAsyncActivity({
          id: `import-parse-${file.name}`,
          label: "Đang đọc file Excel",
          detail: file.name,
          task: async (updateProgress) => {
            updateProgress(15, "Đang tải nội dung file...");
            await new Promise((resolve) => window.setTimeout(resolve, 80));
            updateProgress(45, "Đang phân tích sheet...");
            const result = await buildImportPreviewFromFileWithHeaders(
              file,
              lessonOptions,
              defaultLessonId,
            );
            updateProgress(85, `Đã đọc ${result.rows.length} dòng`);
            await new Promise((resolve) => window.setTimeout(resolve, 80));
            updateProgress(100, "Hoàn tất đọc file");
            return result;
          },
        });

        if (parsed.rows.length === 0) {
          showErrorToast("File không có dữ liệu hợp lệ. Kiểm tra lại mẫu Excel.");
          return;
        }

        const mappings = buildImportColumnMappings(parsed.detectedHeaders);
        setFileName(file.name);
        setPreviewRows(parsed.rows);
        setFieldMappings(mappings);
        setMatchedColumnCount(countMatchedColumns(mappings));
        setStep("review");
      } catch {
        showErrorToast("Không đọc được file. Vui lòng dùng mẫu Excel .xlsx.");
      } finally {
        setIsParsingFile(false);
      }
    },
    [defaultLessonId, lessonOptions],
  );

  const updateDefaultLessonId = useCallback(
    (lessonId: number | null) => {
      setDefaultLessonId(lessonId);
      setPreviewRows((current) => refreshPreviewLessons(current, lessonId));
    },
    [refreshPreviewLessons],
  );

  const reset = useCallback(() => {
    setStep("upload");
    setFileName(null);
    setFieldMappings([]);
    setMatchedColumnCount(0);
    setIsParsingFile(false);
    setPreviewRows([]);
    setDefaultLessonId(initialLessonId);
  }, [initialLessonId]);

  const lessonIssueCount = countImportLessonIssues(previewRows);

  return {
    step,
    fileName,
    fieldMappings,
    matchedColumnCount,
    isParsingFile,
    previewRows,
    rowCount: previewRows.length,
    defaultLessonId,
    lessonIssueCount,
    handleFile,
    updateDefaultLessonId,
    reset,
  };
}
