import { useEffect } from "react";

import { IMPORT_SUCCESS_COUNT } from "../../constants/import-batch.constants";
import { useImportBatch } from "../../hooks/use-import-batch";
import { ImportBatchHeader } from "./import-batch/import-batch-header";
import {
  ImportReviewPlaceholder,
  ImportReviewSection,
} from "./import-batch/import-review-section";
import { ImportSuccessModal } from "./import-batch/import-success-modal";
import { ImportUploadZone } from "./import-batch/import-upload-zone";
import { ModalOverlay } from "./modal-overlay";

type ImportBatchModalProps = {
  open: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
};

export function ImportBatchModal({
  open,
  onClose,
  onImportComplete,
}: ImportBatchModalProps) {
  const {
    step,
    fileName,
    fieldMappings,
    isProcessing,
    showSuccess,
    previewRows,
    rowCount,
    handleFile,
    updateMapping,
    reset,
    finalizeImport,
    closeSuccess,
  } = useImportBatch();

  const isReview = step === "review";

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  function handleClose() {
    reset();
    onClose();
  }

  function handleSuccessClose() {
    closeSuccess();
    reset();
    onClose();
  }

  return (
    <>
      <ModalOverlay glass labelledBy="import-batch-title" onClose={handleClose} open={open}>
        <div className="custom-scrollbar mx-auto flex max-h-[calc(100vh-32px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-background shadow-2xl">
          <div className="custom-scrollbar flex-1 overflow-y-auto p-md lg:p-xl">
            <div className="mx-auto max-w-6xl space-y-gutter">
              <ImportBatchHeader
                onClose={handleClose}
                onDownloadTemplate={() => {
                  window.alert("Tải file mẫu .xlsx (demo).");
                }}
              />

              <ImportUploadZone
                compact={isReview}
                fileName={fileName}
                onFileSelect={handleFile}
              />

              {isReview ? (
                <ImportReviewSection
                  fieldMappings={fieldMappings}
                  isProcessing={isProcessing}
                  onCancel={handleClose}
                  onFinalize={() =>
                    finalizeImport((count) => onImportComplete(count))
                  }
                  onMappingChange={updateMapping}
                  previewRows={previewRows}
                  rowCount={rowCount}
                />
              ) : (
                <ImportReviewPlaceholder />
              )}
            </div>
          </div>
        </div>
      </ModalOverlay>

      <ImportSuccessModal
        importedCount={IMPORT_SUCCESS_COUNT}
        onClose={handleSuccessClose}
        open={showSuccess}
      />
    </>
  );
}
