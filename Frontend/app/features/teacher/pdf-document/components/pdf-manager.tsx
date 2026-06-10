import { useMemo, useRef, useState } from "react";

import {
  useDeletePdfDocumentMutation,
  usePdfDocumentsQuery,
  useUploadPdfDocumentMutation,
} from "~/shared/hooks/use-pdf-documents";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { useQuestionMetadataQuery } from "../../question-library/hooks/use-question-library-queries";
import { MaterialIcon } from "../../components/teacher-icons";

export function PdfManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const documentsQuery = usePdfDocumentsQuery();
  const metadataQuery = useQuestionMetadataQuery();
  const uploadMutation = useUploadPdfDocumentMutation();
  const deleteMutation = useDeletePdfDocumentMutation();

  const lessonOptions = useMemo(
    () =>
      [...(metadataQuery.data?.lessonOptions ?? [])].sort((a, b) =>
        `${a.subjectTitle}/${a.chapterTitle}/${a.title}`.localeCompare(
          `${b.subjectTitle}/${b.chapterTitle}/${b.title}`,
          "vi",
        ),
      ),
    [metadataQuery.data?.lessonOptions],
  );

  const resetForm = () => {
    setTitle("");
    setLessonId("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !lessonId || !file) {
      showErrorToast("Vui lòng nhập tên, chọn bài học và chọn file PDF.");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      showErrorToast("Chỉ hỗ trợ file PDF.");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        lessonId: Number(lessonId),
        title: title.trim(),
        file,
      });
      showSuccessToast("Tải tài liệu PDF lên thành công.");
      resetForm();
      setShowUploadForm(false);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể tải PDF lên.");
    }
  };

  const handleDelete = async (materialId: number, documentTitle: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu "${documentTitle}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(materialId);
      showSuccessToast("Đã xóa tài liệu PDF.");
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể xóa tài liệu.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-primary">
            Tài liệu PDF
          </h3>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Tải giáo trình và tài liệu đọc lên theo từng bài học để học sinh sử dụng.
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm transition hover:opacity-90 sm:w-auto"
          onClick={() => setShowUploadForm((current) => !current)}
          type="button"
        >
          <MaterialIcon>{showUploadForm ? "close" : "upload_file"}</MaterialIcon>
          <span className="text-label-md font-medium">
            {showUploadForm ? "Đóng biểu mẫu" : "Tải PDF lên"}
          </span>
        </button>
      </div>

      {showUploadForm ? (
        <form
          className="grid gap-md rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm lg:grid-cols-2"
          onSubmit={handleUpload}
        >
          <label className="space-y-2">
            <span className="block text-label-md font-semibold text-primary">
              Tên tài liệu
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant/50 bg-white px-4 py-3 text-body-md outline-none transition focus:border-secondary"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ví dụ: Giáo trình chương 1"
              value={title}
            />
          </label>

          <label className="space-y-2">
            <span className="block text-label-md font-semibold text-primary">
              Bài học
            </span>
            <select
              className="w-full rounded-lg border border-outline-variant/50 bg-white px-4 py-3 text-body-md outline-none transition focus:border-secondary"
              disabled={metadataQuery.isLoading}
              onChange={(event) => setLessonId(event.target.value)}
              value={lessonId}
            >
              <option value="">
                {metadataQuery.isLoading ? "Đang tải bài học..." : "Chọn bài học"}
              </option>
              {lessonOptions.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.subjectTitle} / {lesson.chapterTitle} / {lesson.title}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="block text-label-md font-semibold text-primary">
              File PDF
            </span>
            <input
              accept="application/pdf,.pdf"
              className="block w-full rounded-lg border border-dashed border-outline-variant/70 bg-surface-container-low px-4 py-5 text-body-md file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-label-md file:font-semibold file:text-on-primary"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
          </label>

          <div className="flex justify-end gap-3 lg:col-span-2">
            <button
              className="rounded-lg border border-outline-variant/50 bg-white px-5 py-2.5 text-label-md font-semibold text-primary"
              onClick={resetForm}
              type="button"
            >
              Xóa dữ liệu
            </button>
            <button
              className="rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={uploadMutation.isPending}
              type="submit"
            >
              {uploadMutation.isPending ? "Đang tải lên..." : "Tải lên"}
            </button>
          </div>
        </form>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <div className="hidden grid-cols-[70px_minmax(0,1fr)_minmax(180px,1fr)_90px_120px] gap-4 border-b border-outline-variant/20 bg-surface-container-low px-md py-sm text-label-sm font-semibold uppercase text-on-surface-variant md:grid">
          <span>Mã</span>
          <span>Tài liệu</span>
          <span>Phạm vi</span>
          <span>Số trang</span>
          <span>Thao tác</span>
        </div>

        {documentsQuery.isLoading ? (
          <div className="p-md text-body-md text-on-surface-variant">
            Đang tải danh sách tài liệu...
          </div>
        ) : null}

        {documentsQuery.isError ? (
          <div className="p-md text-body-md text-error">
            Không thể tải danh sách tài liệu PDF.
          </div>
        ) : null}

        {!documentsQuery.isLoading && !documentsQuery.isError && documentsQuery.data?.length === 0 ? (
          <div className="p-lg text-center text-body-md text-on-surface-variant">
            Chưa có tài liệu PDF nào.
          </div>
        ) : null}

        <div className="divide-y divide-outline-variant/20">
          {documentsQuery.data?.map((document) => (
            <article
              className="grid gap-3 px-md py-md md:grid-cols-[70px_minmax(0,1fr)_minmax(180px,1fr)_90px_120px] md:items-center"
              key={document.materialId}
            >
              <span className="text-label-md font-semibold text-secondary">
                PDF{document.materialId}
              </span>
              <div className="flex min-w-0 items-center gap-sm">
                <MaterialIcon className="shrink-0 text-error">picture_as_pdf</MaterialIcon>
                <span className="break-words font-semibold text-primary">
                  {document.title}
                </span>
              </div>
              <span className="text-label-md text-on-surface-variant">
                {document.subjectTitle} / {document.chapterTitle} / {document.lessonTitle}
              </span>
              <span className="text-label-md font-medium text-on-surface-variant">
                {document.pageCount ?? "-"}
              </span>
              <div className="flex items-center gap-2">
                <a
                  aria-label={`Tải ${document.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-container text-primary transition hover:opacity-80"
                  href={document.resourceUrl}
                  rel="noreferrer"
                  target="_blank"
                  title="Tải xuống"
                >
                  <MaterialIcon>download</MaterialIcon>
                </a>
                <button
                  aria-label={`Xóa ${document.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-container text-error transition hover:opacity-80 disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleDelete(document.materialId, document.title)}
                  title="Xóa"
                  type="button"
                >
                  <MaterialIcon>delete</MaterialIcon>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
