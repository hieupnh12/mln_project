import { useState } from "react";

import { MaterialIcon } from "../../../components/teacher-icons";
import {
  defaultExportConfig,
  defaultRandomExamConfig,
} from "../../constants/export-exam.constants";
import type { ExportConfig, RandomExamConfig } from "../../types/export-exam.types";
import { ExamPreviewModal } from "./exam-preview-modal";
import { ExportConfigSection } from "./export-config-section";
import { ModalOverlay } from "./modal-overlay";
import { RandomExamConfigSection } from "./random-exam-config-section";

type ExportExamModalProps = {
  open: boolean;
  poolSize: number;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  onGenerate: (config: RandomExamConfig) => void;
};

export function ExportExamModal({
  open,
  poolSize,
  onClose,
  onExport,
  onGenerate,
}: ExportExamModalProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>(defaultExportConfig);
  const [randomConfig, setRandomConfig] =
    useState<RandomExamConfig>(defaultRandomExamConfig);
  const [previewOpen, setPreviewOpen] = useState(false);

  function handleExport() {
    onExport(exportConfig);
  }

  function handleFinalize() {
    onGenerate(randomConfig);
    setPreviewOpen(false);
    onClose();
  }

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
                Thiết lập xuất dữ liệu và tạo đề thi ngẫu nhiên từ ngân hàng câu hỏi.
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
            <section className="space-y-gutter lg:col-span-5">
              <ExportConfigSection
                config={exportConfig}
                onChange={setExportConfig}
                onExport={handleExport}
              />
            </section>
            <section className="lg:col-span-7">
              <RandomExamConfigSection
                config={randomConfig}
                onChange={setRandomConfig}
                onPreview={() => setPreviewOpen(true)}
                onSave={() => {
                  window.alert("Đã lưu cấu hình đề thi (demo).");
                }}
                poolSize={poolSize}
              />
            </section>
          </div>
        </div>
      </ModalOverlay>

      <ExamPreviewModal
        onClose={() => setPreviewOpen(false)}
        onFinalize={handleFinalize}
        open={previewOpen}
      />
    </>
  );
}
