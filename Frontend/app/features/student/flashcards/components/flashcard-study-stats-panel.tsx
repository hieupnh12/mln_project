import { Brain, Star, Timer } from "lucide-react";
import type { ReactNode } from "react";

type FlashcardStudyStatsPanelProps = {
  completionPercentage: number;
  estimatedMinutes: number;
  masteredCount: number;
  masteryLevel: string;
  totalCards: number;
};

export function FlashcardStudyStatsPanel({
  completionPercentage,
  estimatedMinutes,
  masteredCount,
  masteryLevel,
  totalCards,
}: FlashcardStudyStatsPanelProps) {
  return (
    <aside className="space-y-md rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5">
      <section className="border-b border-outline-variant/25 pb-md">
        <h2 className="mb-3 flex items-center gap-2 text-label-md font-semibold text-secondary">
          <Brain aria-hidden="true" className="h-4 w-4" />
          Tiến trình học tập
        </h2>
        <div className="flex items-center justify-between text-label-sm">
          <span className="text-landing-text-soft">Thẻ đã thuộc</span>
          <span className="rounded-full bg-secondary-container/45 px-2.5 py-0.5 font-semibold text-secondary">
            {masteredCount} / {totalCards}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-landing-gray">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="mt-3 text-label-sm leading-relaxed text-landing-text-soft">
          Đánh dấu thẻ đã thuộc bằng biểu tượng sao trên thẻ hoặc trong danh sách bên dưới.
        </p>
      </section>

      <section className="space-y-3 border-b border-outline-variant/25 pb-md">
        <h3 className="text-label-md font-semibold text-landing-text">Chỉ số rèn luyện</h3>

        <StatRow
          icon={<Timer aria-hidden="true" className="h-4 w-4" />}
          label="Thời gian dự kiến"
          value={`${estimatedMinutes} phút`}
        />
        <StatRow
          icon={<Brain aria-hidden="true" className="h-4 w-4" />}
          label="Độ thông thuộc"
          value={masteryLevel}
        />
        <StatRow
          icon={<Star aria-hidden="true" className="h-4 w-4" />}
          label="Tỷ lệ hoàn thành"
          value={`${completionPercentage}% mục tiêu`}
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
          Phím tắt
        </h3>
        <ShortcutRow keys="Space" label="Lật thẻ" />
        <ShortcutRow keys="→" label="Thẻ tiếp theo" />
        <ShortcutRow keys="←" label="Thẻ trước" />
      </section>
    </aside>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-outline-variant/25 bg-landing-gray/50 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container/40 text-secondary">
        {icon}
      </span>
      <div>
        <p className="text-label-sm text-landing-text-soft">{label}</p>
        <p className="text-label-md font-semibold text-landing-text">{value}</p>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-landing-gray/40 px-3 py-2 text-label-sm text-landing-text-soft">
      <span>{label}</span>
      <kbd className="rounded border border-outline-variant/35 bg-landing-white px-2 py-0.5 font-mono text-label-sm font-semibold text-landing-text">
        {keys}
      </kbd>
    </div>
  );
}
