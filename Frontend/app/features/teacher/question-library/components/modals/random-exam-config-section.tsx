import { MaterialIcon } from "../../../components/teacher-icons";
import { chapterTargetOptions } from "../../constants/export-exam.constants";
import type { RandomExamConfig } from "../../types/export-exam.types";

type RandomExamConfigSectionProps = {
  config: RandomExamConfig;
  poolSize: number;
  onChange: (config: RandomExamConfig) => void;
  onPreview: () => void;
  onSave: () => void;
};

export function RandomExamConfigSection({
  config,
  poolSize,
  onChange,
  onPreview,
  onSave,
}: RandomExamConfigSectionProps) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary-container p-2">
            <MaterialIcon className="text-on-secondary-container">shuffle</MaterialIcon>
          </div>
          <h3 className="text-headline-md font-semibold text-primary">
            Tạo đề ngẫu nhiên
          </h3>
        </div>
        <span className="rounded-full bg-surface-container-high px-4 py-1.5 text-label-sm font-semibold text-on-surface-variant">
          v2.4 Active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div className="space-y-4">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Tổng số câu
          </span>
          <div className="relative">
            <input
              className="w-full rounded-lg border-none bg-surface-container-low p-4 text-center text-headline-md font-semibold focus:ring-2 focus:ring-secondary/20"
              min={1}
              onChange={(e) =>
                onChange({ ...config, totalCount: Number(e.target.value) || 1 })
              }
              type="number"
              value={config.totalCount}
            />
            <div className="absolute inset-y-0 right-4 flex flex-col justify-center gap-1">
              <button
                aria-label="Tăng số câu"
                className="text-on-surface-variant transition hover:text-primary"
                onClick={() =>
                  onChange({ ...config, totalCount: config.totalCount + 1 })
                }
                type="button"
              >
                <MaterialIcon>keyboard_arrow_up</MaterialIcon>
              </button>
              <button
                aria-label="Giảm số câu"
                className="text-on-surface-variant transition hover:text-primary"
                onClick={() =>
                  onChange({
                    ...config,
                    totalCount: Math.max(1, config.totalCount - 1),
                  })
                }
                type="button"
              >
                <MaterialIcon>keyboard_arrow_down</MaterialIcon>
              </button>
            </div>
          </div>
          <p className="text-center text-label-sm italic text-on-surface-variant/60">
            Có sẵn trong kho: {poolSize.toLocaleString("vi-VN")} câu hỏi
          </p>
        </div>

        <DifficultyDistribution config={config} />
      </div>

      <div className="mt-8 space-y-6">
        <DifficultySlider
          fillColor="#bfe8e6"
          label="Nội dung cơ bản"
          onChange={(easyPercent) => {
            const remaining = 100 - easyPercent;
            const hardPercent = Math.min(config.hardPercent, remaining);
            const mediumPercent = remaining - hardPercent;
            onChange({ ...config, easyPercent, mediumPercent, hardPercent });
          }}
          percent={config.easyPercent}
        />
        <DifficultySlider
          fillColor="#232733"
          label="Logic nâng cao"
          onChange={(hardPercent) => {
            const capped = Math.min(hardPercent, 100 - config.easyPercent);
            const mediumPercent = 100 - config.easyPercent - capped;
            onChange({ ...config, hardPercent: capped, mediumPercent });
          }}
          percent={config.hardPercent}
        />
      </div>

      <div className="mt-10 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Chương / bài mục tiêu
        </span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {chapterTargetOptions.map((chapter) => {
            const selected = config.selectedChapterIds.includes(chapter.id);
            return (
              <button
                className={
                  selected
                    ? "rounded-xl border border-secondary bg-secondary-container/30 p-4 text-left transition-all"
                    : "rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4 text-left transition-all hover:border-secondary/50"
                }
                key={chapter.id}
                onClick={() => toggleChapter(config, chapter.id, onChange)}
                type="button"
              >
                <div className="mb-2 flex justify-between">
                  <MaterialIcon
                    className={selected ? "text-secondary" : "text-on-surface-variant/30"}
                    filled={selected}
                  >
                    {selected ? "check_circle" : "circle"}
                  </MaterialIcon>
                  <span
                    className={
                      selected
                        ? "text-label-sm font-bold text-secondary"
                        : "text-label-sm font-bold text-on-surface-variant"
                    }
                  >
                    {chapter.shortLabel}
                  </span>
                </div>
                <span className="block text-label-md leading-tight">{chapter.title}</span>
              </button>
            );
          })}
          <button
            className="flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 p-4 text-on-surface-variant transition hover:border-primary/50 hover:text-primary"
            type="button"
          >
            <MaterialIcon>add</MaterialIcon>
            <span className="ml-1 text-label-md font-medium">Xem tất cả</span>
          </button>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-primary py-4 text-label-md font-medium text-primary transition hover:bg-primary hover:text-on-primary"
          onClick={onPreview}
          type="button"
        >
          <MaterialIcon>visibility</MaterialIcon>
          Xem trước đề
        </button>
        <button
          aria-label="Lưu cấu hình"
          className="flex items-center justify-center rounded-lg bg-secondary px-6 py-4 text-on-secondary transition hover:opacity-90"
          onClick={onSave}
          type="button"
        >
          <MaterialIcon>save</MaterialIcon>
        </button>
      </div>
    </div>
  );
}

function DifficultyDistribution({ config }: { config: RandomExamConfig }) {
  return (
    <div className="space-y-4">
      <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Phân bổ độ khó
      </span>
      <div className="flex h-14 overflow-hidden rounded-lg border border-outline-variant/10 shadow-inner">
        <div
          className="flex items-center justify-center bg-secondary-container font-bold text-on-secondary-fixed-variant"
          style={{ width: `${config.easyPercent}%` }}
        >
          {config.easyPercent}%
        </div>
        <div
          className="flex items-center justify-center bg-secondary-fixed-dim font-bold text-on-secondary-fixed-variant"
          style={{ width: `${config.mediumPercent}%` }}
        >
          {config.mediumPercent}%
        </div>
        <div
          className="flex items-center justify-center bg-primary-container font-bold text-on-primary"
          style={{ width: `${config.hardPercent}%` }}
        >
          {config.hardPercent}%
        </div>
      </div>
      <div className="flex justify-between px-1 text-label-sm">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary-container" />
          Cơ bản
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary-fixed-dim" />
          Vận dụng
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary-container" />
          Nâng cao
        </span>
      </div>
    </div>
  );
}

function DifficultySlider({
  label,
  percent,
  fillColor,
  onChange,
}: {
  label: string;
  percent: number;
  fillColor: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-body-md">
        <span>{label}</span>
        <span className="font-bold text-secondary">{percent}%</span>
      </div>
      <input
        className="custom-range h-2 w-full cursor-pointer appearance-none rounded-lg"
        max={100}
        min={0}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, #f0edee ${percent}%, #f0edee 100%)`,
        }}
        type="range"
        value={percent}
      />
    </div>
  );
}

function toggleChapter(
  config: RandomExamConfig,
  chapterId: string,
  onChange: (config: RandomExamConfig) => void,
) {
  const selected = config.selectedChapterIds.includes(chapterId);
  const selectedChapterIds = selected
    ? config.selectedChapterIds.filter((id) => id !== chapterId)
    : [...config.selectedChapterIds, chapterId];

  onChange({ ...config, selectedChapterIds });
}
