import { useMemo, useRef, useState } from "react";

import {
  useDeleteSubjectDocumentMutation,
  useSubjectDocumentsBySubjectQuery,
  useUploadSubjectDocumentMutation,
} from "~/shared/hooks/use-subject-documents";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import {
  SUBJECT_DOCUMENT_ALLOWED_EXTENSIONS,
} from "../constants/subject-document.constants";

function getFileExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  if (index < 0) {
    return "";
  }
  return filename.slice(index + 1).toLowerCase();
}

export function useSubjectDocumentManager(subjectId: number) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [search, setSearch] = useState("");

  const documentsQuery = useSubjectDocumentsBySubjectQuery(subjectId);
  const uploadMutation = useUploadSubjectDocumentMutation(subjectId);
  const deleteMutation = useDeleteSubjectDocumentMutation(subjectId);

  const filteredDocuments = useMemo(() => {
    const documents = documentsQuery.data ?? [];
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return documents;
    }

    return documents.filter((document) => {
      const haystack = [
        document.title,
        document.originalFilename,
        document.fileExtension,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [documentsQuery.data, search]);

  const resetForm = () => {
    setTitle("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !file) {
      showErrorToast("Vui lòng nhập tên tài liệu và chọn file.");
      return;
    }

    const extension = getFileExtension(file.name);
    if (
      !SUBJECT_DOCUMENT_ALLOWED_EXTENSIONS.includes(
        extension as (typeof SUBJECT_DOCUMENT_ALLOWED_EXTENSIONS)[number],
      )
    ) {
      showErrorToast(
        "Định dạng không hỗ trợ. Dùng PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP hoặc ảnh.",
      );
      return;
    }

    try {
      await runWithAsyncActivity({
        label: "Đang tải tài liệu lên",
        detail: file.name,
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(15, "Đang gửi file...");
          await uploadMutation.mutateAsync({
            subjectId,
            title: title.trim(),
            file,
          });
          updateProgress(100, "Hoàn tất");
        },
      });
      showSuccessToast("Tải tài liệu lên thành công.");
      resetForm();
      setShowUploadForm(false);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể tải tài liệu lên.");
    }
  };

  const handleDelete = async (documentId: number, documentTitle: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu "${documentTitle}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(documentId);
      showSuccessToast("Đã xóa tài liệu.");
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
    resetForm,
    search,
    setFile,
    setSearch,
    setTitle,
    showUploadForm,
    title,
    toggleUploadForm,
    uploadMutation,
  };
}
