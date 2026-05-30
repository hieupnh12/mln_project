import type { LessonOptionDto } from "../../types/question-library-api.types";
import type { QuestionDraft } from "../../types/question-library.types";
import { CreateQuestionEditor } from "./create-question/create-question-editor";
import { CreateQuestionFooter } from "./create-question/create-question-footer";
import { CreateQuestionHeader } from "./create-question/create-question-header";
import { CreateQuestionMetadata } from "./create-question/create-question-metadata";
import { CreateQuestionOptions } from "./create-question/create-question-options";
import { ModalOverlay } from "./modal-overlay";

type AddQuestionModalProps = {
  open: boolean;
  draft: QuestionDraft;
  lessonOptions: LessonOptionDto[];
  lessonsLoading?: boolean;
  lessonsError?: boolean;
  onRetryLessons?: () => void;
  saving?: boolean;
  onClose: () => void;
  onDraftChange: (draft: QuestionDraft) => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export function AddQuestionModal({
  open,
  draft,
  lessonOptions,
  lessonsLoading = false,
  lessonsError = false,
  onRetryLessons,
  saving = false,
  onClose,
  onDraftChange,
  onDiscard,
  onSaveDraft,
  onPublish,
}: AddQuestionModalProps) {
  return (
    <ModalOverlay glass labelledBy="add-question-title" onClose={onClose} open={open}>
      <div className="mx-auto flex max-h-[min(921px,calc(100vh-32px))] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <CreateQuestionHeader onClose={onClose} />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-md lg:p-lg">
          <section className="grid grid-cols-1 gap-lg lg:grid-cols-12">
            <div className="space-y-md lg:col-span-7">
              <CreateQuestionEditor draft={draft} onChange={onDraftChange} />
              <CreateQuestionOptions draft={draft} onChange={onDraftChange} />
            </div>
            <div className="lg:col-span-5">
              <CreateQuestionMetadata
                draft={draft}
                lessonOptions={lessonOptions}
                lessonsError={lessonsError}
                lessonsLoading={lessonsLoading}
                onChange={onDraftChange}
                onRetryLessons={onRetryLessons}
              />
            </div>
          </section>
        </div>

        <CreateQuestionFooter
          onDiscard={onDiscard}
          onPublish={onPublish}
          onSaveDraft={onSaveDraft}
          saving={saving}
        />
      </div>
    </ModalOverlay>
  );
}
