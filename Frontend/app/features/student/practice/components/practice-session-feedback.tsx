import { Link } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type PracticeSessionFeedbackProps = {
  courseTitle: string;
  exitHref: string;
  onBackToSetup: () => void;
  onRetry?: () => void;
  state: "loading" | "error" | "empty";
};

const feedbackCopy = {
  loading: {
    icon: "hourglass_top",
    title: "Đang chuẩn bị phiên luyện tập",
    description: "Hệ thống đang lấy bộ câu hỏi phù hợp với phạm vi bạn đã chọn.",
  },
  error: {
    icon: "error_outline",
    title: "Không tải được câu hỏi luyện tập",
    description: "Kết nối chưa ổn hoặc dữ liệu vừa thay đổi. Bạn có thể thử lại.",
  },
  empty: {
    icon: "quiz",
    title: "Chưa có câu hỏi phù hợp",
    description: "Phạm vi này chưa có câu hỏi trắc nghiệm đủ đáp án để luyện tập.",
  },
} as const;

export function PracticeSessionFeedback({
  courseTitle,
  exitHref,
  onBackToSetup,
  onRetry,
  state,
}: PracticeSessionFeedbackProps) {
  const copy = feedbackCopy[state];

  return (
    <div className="min-h-svh bg-background text-on-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/10 bg-background px-margin-mobile text-primary md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            aria-label="Thoát luyện tập"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
            to={exitHref}
          >
            <MaterialIcon>close</MaterialIcon>
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-label-md font-bold text-primary">
              {courseTitle}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Luyện tập
            </p>
          </div>
        </div>

        <button
          className="rounded-lg bg-surface-container px-4 py-2 text-label-md font-medium text-on-surface-variant transition-all hover:bg-surface-variant"
          onClick={onBackToSetup}
          type="button"
        >
          Thiết lập
        </button>
      </header>

      <main className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl items-center px-margin-mobile py-gutter md:px-margin-desktop">
        <section className="w-full rounded-xl border border-outline-variant/20 bg-white p-gutter text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-secondary">
            <MaterialIcon className={state === "loading" ? "animate-spin" : ""}>
              {copy.icon}
            </MaterialIcon>
          </div>
          <h2 className="mt-4 text-headline-md font-semibold text-primary">
            {copy.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
            {copy.description}
          </p>

          <div className="mt-md flex flex-col-reverse gap-sm sm:flex-row sm:justify-center">
            <button
              className="rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary transition hover:bg-surface-container-low"
              onClick={onBackToSetup}
              type="button"
            >
              Quay lại thiết lập
            </button>
            {onRetry ? (
              <button
                className="rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary transition hover:opacity-90"
                onClick={onRetry}
                type="button"
              >
                Thử lại
              </button>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
