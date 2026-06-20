import { PdfDocumentHeader } from "./pdf-document-header";
import { PdfDocumentList } from "./pdf-document-list";
import { PdfDocumentShell } from "./pdf-document-shell";
import { PdfUploadForm } from "./pdf-upload-form";
import { usePdfDocumentManager } from "../hooks/use-pdf-document-manager";

export function PdfManager() {
  const manager = usePdfDocumentManager();

  return (
    <PdfDocumentShell>
      <div className="space-y-md">
      <PdfDocumentHeader
        onToggleUpload={manager.toggleUploadForm}
        showUploadForm={manager.showUploadForm}
      />

      {manager.showUploadForm ? (
        <PdfUploadForm
          file={manager.file}
          fileInputRef={manager.fileInputRef}
          isLessonsLoading={manager.metadataQuery.isLoading}
          isUploading={manager.uploadMutation.isPending}
          lessonId={manager.lessonId}
          lessonOptions={manager.lessonOptions}
          onFileChange={manager.setFile}
          onLessonChange={manager.setLessonId}
          onReset={manager.resetForm}
          onSubmit={manager.handleUpload}
          onTitleChange={manager.setTitle}
          title={manager.title}
        />
      ) : null}

      <PdfDocumentList
        documents={manager.filteredDocuments}
        isDeleting={manager.deleteMutation.isPending}
        isError={manager.documentsQuery.isError}
        isLoading={manager.documentsQuery.isLoading}
        onDelete={manager.handleDelete}
        onSearchChange={manager.setSearch}
        search={manager.search}
      />
      </div>
    </PdfDocumentShell>
  );
}
