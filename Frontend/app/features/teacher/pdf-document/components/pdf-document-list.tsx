import { MaterialIcon } from "../../components/teacher-icons";
import type { PdfDocument } from "~/shared/types/pdf-document.types";
import { PdfDocumentRow } from "./pdf-document-row";

type PdfDocumentListProps = {
  documents: PdfDocument[];
  isDeleting: boolean;
  isError?: boolean;
  isLoading?: boolean;
  onDelete: (materialId: number, documentTitle: string) => void;
  onSearchChange: (value: string) => void;
  search: string;
};

export function PdfDocumentList({
  documents,
  isDeleting,
  isError = false,
  isLoading = false,
  onDelete,
  onSearchChange,
  search,
}: PdfDocumentListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-headline-md font-semibold text-landing-text">Danh sách tài liệu</h2>
        <label className="relative w-full max-w-sm">
          <span className="sr-only">Tìm tài liệu</span>
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-landing-text-soft">
            search
          </MaterialIcon>
          <input
            className="w-full rounded-xl border-0 bg-landing-gray/50 py-2.5 pl-10 pr-3 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm tài liệu..."
            type="search"
            value={search}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-landing-gray/40 p-md text-body-md text-landing-text-soft">
          Đang tải danh sách tài liệu...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-error/30 bg-error-container/30 p-md text-label-md font-medium text-error">
          Không thể tải danh sách tài liệu PDF.
        </div>
      ) : null}

      {!isLoading && !isError && documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/25 p-lg text-center">
          <MaterialIcon className="mx-auto mb-3 text-[36px] text-catalog-cobalt/70">picture_as_pdf</MaterialIcon>
          <p className="text-body-md text-landing-text-soft">
            {search.trim() ? "Không có tài liệu phù hợp từ khóa tìm kiếm." : "Chưa có tài liệu PDF nào."}
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((document) => (
            <PdfDocumentRow
              document={document}
              isDeleting={isDeleting}
              key={document.materialId}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
