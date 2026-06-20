import { ClipboardList } from "lucide-react";

export function ExamCatalogIntro() {
  return (
    <div className="mb-md flex items-center gap-3 rounded-xl border border-outline-variant/35 bg-landing-white px-4 py-3 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-secondary/15 bg-secondary-container/40 text-secondary">
        <ClipboardList aria-hidden="true" className="h-4 w-4" />
      </span>
      <p className="text-body-md leading-snug text-landing-text-soft">
        <span className="font-semibold text-landing-text">Bài kiểm tra theo môn</span>
        <span> — hoàn thành đúng hạn để ghi nhận kết quả học tập.</span>
      </p>
    </div>
  );
}
