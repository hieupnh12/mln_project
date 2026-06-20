import { useMemo, useRef, useState } from "react";

import {
  useDeletePdfDocumentMutation,
  usePdfDocumentsQuery,
  useUploadPdfDocumentMutation,
} from "~/shared/hooks/use-pdf-documents";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { useQuestionMetadataQuery } from "../../question-library/hooks/use-question-library-queries";
import type { LessonOptionDto } from "../../question-library/types/question-library-api.types";

export function usePdfDocumentManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [search, setSearch] = useState("");

  const documentsQuery = usePdfDocumentsQuery();
  const metadataQuery = useQuestionMetadataQuery();
  const uploadMutation = useUploadPdfDocumentMutation();
  const deleteMutation = useDeletePdfDocumentMutation();

  const lessonOptions = useMemo<LessonOptionDto[]>(
    () =>
      [...(metadataQuery.data?.lessonOptions ?? [])].sort((a, b) =>
        `${a.subjectTitle}/${a.chapterTitle}/${a.title}`.localeCompare(
          `${b.subjectTitle}/${b.chapterTitle}/${b.title}`,
          "vi",
        ),
      ),
    [metadataQuery.data?.lessonOptions],
  );

  const filteredDocuments = useMemo(() => {
    const documents = documentsQuery.data ?? [];
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return documents;
    }

    return documents.filter((document) => {
      const haystack = [
        document.title,
        document.subjectTitle,
        document.chapterTitle,
        document.lessonTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [documentsQuery.data, search]);

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

  const toggleUploadForm = () => {
    setShowUploadForm((current) => !current);
  };

  return {
    deleteMutation,
    documentsQuery,
    file,
    fileInputRef,
    filteredDocuments,
    handleDelete,
    handleUpload,
    lessonId,
    lessonOptions,
    metadataQuery,
    resetForm,
    search,
    setFile,
    setLessonId,
    setSearch,
    setTitle,
    setShowUploadForm,
    showUploadForm,
    title,
    toggleUploadForm,
    uploadMutation,
  };
}
