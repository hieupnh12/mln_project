import { MaterialIcon } from "../../components/teacher-icons";

type QuizEditorDetailStateProps = {
  isError: boolean;
  onBack: () => void;
  onRetry: () => void;
};

export function QuizEditorDetailState({
  isError,
  onBack,
  onRetry,
}: QuizEditorDetailStateProps) {
  return (
    <section className="space-y-gutter">
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-secondary transition hover:bg-surface-container-low hover:text-primary"
        onClick={onBack}
        type="button"
      >
        <MaterialIcon>arrow_back</MaterialIcon>
        Quay lại danh sách
      </button>

      {isError ? (
        <div className="rounded-xl border border-error/20 bg-error-container/20 px-md py-lg text-center">
          <MaterialIcon className="text-[36px] text-error">error</MaterialIcon>
          <h2 className="mt-3 text-headline-md font-semibold text-primary">
            Không thể tải chi tiết quiz
          </h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Dữ liệu quiz chưa được thay bằng giá trị mặc định. Hãy thử tải lại.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-medium text-on-primary transition hover:opacity-90"
            onClick={onRetry}
            type="button"
          >
            <MaterialIcon>refresh</MaterialIcon>
            Thử lại
          </button>
        </div>
      ) : (
        <div aria-busy="true" aria-label="Đang tải chi tiết quiz" className="space-y-sm">
          <div className="h-16 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-12 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-48 animate-pulse rounded-xl bg-surface-container-low" />
          <div className="h-64 animate-pulse rounded-xl bg-surface-container-low" />
        </div>
      )}
    </section>
  );
}
