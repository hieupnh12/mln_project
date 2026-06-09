import { Download } from "lucide-react";

import { showInfoToast } from "~/shared/utils/toast";

import { useMaterialDetailQuery } from "../hooks/use-course-learning-queries";

type CourseMaterialDownloadButtonProps = {
  selectedMaterialId: number | null;
};

export function CourseMaterialDownloadButton({
  selectedMaterialId,
}: CourseMaterialDownloadButtonProps) {
  const materialQuery = useMaterialDetailQuery(selectedMaterialId);
  const resourceUrl = materialQuery.data?.resourceUrl ?? null;
  const isDisabled = selectedMaterialId == null || !resourceUrl || materialQuery.isLoading;

  function handleDownload() {
    if (!resourceUrl) {
      showInfoToast("Tài liệu này chưa có file PDF để tải.");
      return;
    }

    window.open(resourceUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      className="mt-md inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-landing-red to-landing-red-dark px-4 py-3 text-label-md font-semibold text-on-primary shadow-lg shadow-landing-red/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isDisabled}
      onClick={handleDownload}
      type="button"
    >
      <Download aria-hidden="true" className="h-5 w-5" />
      Tải tài liệu PDF
    </button>
  );
}
