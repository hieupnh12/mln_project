import { useCallback, useState } from "react";

import {
  defaultImportFieldMappings,
  importPreviewRows,
  IMPORT_SUCCESS_COUNT,
} from "../constants/import-batch.constants";
import type { ImportBatchStep, ImportFieldMapping } from "../types/import-batch.types";

export function useImportBatch() {
  const [step, setStep] = useState<ImportBatchStep>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] =
    useState<ImportFieldMapping[]>(defaultImportFieldMappings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setStep("review");
  }, []);

  const clearFile = useCallback(() => {
    setFileName(null);
    setStep("upload");
  }, []);

  const updateMapping = useCallback((id: string, selectedColumn: string) => {
    setFieldMappings((current) =>
      current.map((item) =>
        item.id === id ? { ...item, selectedColumn } : item,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    setStep("upload");
    setFileName(null);
    setFieldMappings(defaultImportFieldMappings);
    setIsProcessing(false);
    setShowSuccess(false);
  }, []);

  const finalizeImport = useCallback(
    (onComplete: (count: number) => void) => {
      setIsProcessing(true);
      window.setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        onComplete(IMPORT_SUCCESS_COUNT);
      }, 1200);
    },
    [],
  );

  return {
    step,
    fileName,
    fieldMappings,
    isProcessing,
    showSuccess,
    previewRows: importPreviewRows,
    rowCount: importPreviewRows.length,
    handleFile,
    clearFile,
    updateMapping,
    reset,
    finalizeImport,
    closeSuccess: () => setShowSuccess(false),
  };
}
