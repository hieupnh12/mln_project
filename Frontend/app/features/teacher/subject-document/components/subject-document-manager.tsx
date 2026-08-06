import { SubjectDocumentDetailHeader } from "./subject-document-detail-header";
import { SubjectDocumentList } from "./subject-document-list";
import { SubjectDocumentShell } from "./subject-document-shell";
import { SubjectDocumentUploadForm } from "./subject-document-upload-form";
import { useSubjectDocumentManager } from "../hooks/use-subject-document-manager";

type SubjectDocumentManagerProps = {
  subjectCode?: string;
  subjectId: number;
  subjectTitle: string;
};

export function SubjectDocumentManager({
  subjectCode,
  subjectId,
  subjectTitle,
}: SubjectDocumentManagerProps) {
  const manager = useSubjectDocumentManager(subjectId);

  return (
    <SubjectDocumentShell>
      <div className="space-y-md">
        <SubjectDocumentDetailHeader
          onToggleUpload={manager.toggleUploadForm}
          showUploadForm={manager.showUploadForm}
          subjectCode={subjectCode}
          subjectTitle={subjectTitle}
        />

        {manager.showUploadForm ? (
          <SubjectDocumentUploadForm
            file={manager.file}
            fileInputRef={manager.fileInputRef}
            isUploading={manager.uploadMutation.isPending}
            onFileChange={manager.setFile}
            onReset={manager.resetForm}
            onSubmit={manager.handleUpload}
            onTitleChange={manager.setTitle}
            title={manager.title}
          />
        ) : null}

        <SubjectDocumentList
          documents={manager.filteredDocuments}
          isDeleting={manager.deleteMutation.isPending}
          isError={manager.documentsQuery.isError}
          isLoading={manager.documentsQuery.isLoading}
          onDelete={manager.handleDelete}
          onSearchChange={manager.setSearch}
          search={manager.search}
        />
      </div>
    </SubjectDocumentShell>
  );
}
