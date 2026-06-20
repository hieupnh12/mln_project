import { MaterialIcon } from "../../../components/teacher-icons";
import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
  TEACHER_MODAL_PANEL,
} from "../../../constants/teacher-ui.constants";
import type { LessonOptionDto } from "../../types/question-library-api.types";
import type { RandomExamConfig, RandomExamValidation } from "../../types/export-exam.types";
import { ExamScopeSelector } from "./exam-scope-selector";

type RandomExamConfigSectionProps = {
  config: RandomExamConfig;
  validation: RandomExamValidation;
  lessonOptions: LessonOptionDto[];
  onChange: (config: RandomExamConfig) => void;
  onExportFile: () => void;
  onSaveDraft: () => void;
  actionDisabled?: boolean;
  exporting?: boolean;
  savingDraft?: boolean;
};

export function RandomExamConfigSection({
  config,
  validation,
  lessonOptions,
  onChange,
  onExportFile,
  onSaveDraft,
  actionDisabled = false,
  exporting = false,
  savingDraft = false,
}: RandomExamConfigSectionProps) {
  const canExportFile = validation.valid && !actionDisabled && !exporting && !savingDraft;
  const canSaveDraft = validation.valid && !actionDisabled && !savingDraft && !exporting;

  return (
    <div className={TEACHER_MODAL_PANEL}>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-catalog-cyan/12 p-2 text-catalog-cobalt">
            <MaterialIcon>shuffle</MaterialIcon>
          </div>
          <h3 className="text-headline-md font-semibold text-landing-text">Tạo đề ngẫu nhiên</h3>
        </div>
      </div>

      <div className="space-y-8">
      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div className="space-y-4">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
            Tổng số câu
          </span>
          <div className="relative">
            <input
              className="w-full rounded-xl border-0 bg-landing-white p-4 text-center text-headline-md font-semibold text-landing-text outline-none ring-1 ring-outline-variant/15 focus:ring-primary/25"
              min={1}
              onChange={(event) =>
                onChange({ ...config, totalCount: Number(event.target.value) || 1 })
              }
              type="number"
              value={config.totalCount}
            />
            <div className="absolute inset-y-0 right-4 flex flex-col justify-center gap-1">
              <button
                aria-label="Tăng số câu"
                className="text-on-surface-variant transition hover:text-primary"
                onClick={() => onChange({ ...config, totalCount: config.totalCount + 1 })}
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
          <p className="text-center text-label-sm text-landing-text-soft">
            Có sẵn trong phạm vi:{" "}
            <span className="font-semibold text-catalog-cobalt">
              {validation.poolSize.toLocaleString("vi-VN")} câu
            </span>
          </p>
        </div>

        <DifficultyDistribution config={config} validation={validation} />
      </div>

      <div className="space-y-6">
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

      <ExamScopeSelector
        lessonOptions={lessonOptions}
        onChange={(scope) => onChange({ ...config, scope })}
        scope={config.scope}
      />

      {validation.errors.length > 0 ? (
        <div className="rounded-lg bg-error-container/20 px-4 py-3">
          <p className="mb-2 text-label-md font-semibold text-error">Không thể tạo đề</p>
          <ul className="list-disc space-y-1 pl-5 text-body-md text-on-error-container">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl bg-landing-gray/35 px-4 py-3 text-body-md text-landing-text-soft">
          Phân bổ yêu cầu: Cơ bản {validation.requiredByDifficulty["Cơ bản"]}, Vận dụng{" "}
          {validation.requiredByDifficulty["Vận dụng"]}, Nâng cao{" "}
          {validation.requiredByDifficulty["Nâng cao"]}.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className={`${TEACHER_MODAL_BTN_PRIMARY} flex-1 py-4`}
          disabled={!canExportFile}
          onClick={onExportFile}
          type="button"
        >
          <MaterialIcon>{exporting ? "sync" : "download"}</MaterialIcon>
          {exporting ? "Đang xuất..." : "Xuất file"}
        </button>
        <button
          className={`${TEACHER_MODAL_BTN_SECONDARY} flex-1 py-4`}
          disabled={!canSaveDraft}
          onClick={onSaveDraft}
          type="button"
        >
          <MaterialIcon>{savingDraft ? "sync" : "save"}</MaterialIcon>
          {savingDraft ? "Đang lưu..." : "Lưu bản nháp quiz"}
        </button>
      </div>
      </div>
    </div>
  );
}

function DifficultyDistribution({
  config,
  validation,
}: {
  config: RandomExamConfig;
  validation: RandomExamValidation;
}) {
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
      <div className="grid grid-cols-1 gap-1 text-label-sm sm:grid-cols-3">
        <span>
          Cơ bản: {validation.byDifficulty["Cơ bản"]}/{validation.requiredByDifficulty["Cơ bản"]}
        </span>
        <span>
          Vận dụng: {validation.byDifficulty["Vận dụng"]}/
          {validation.requiredByDifficulty["Vận dụng"]}
        </span>
        <span>
          Nâng cao: {validation.byDifficulty["Nâng cao"]}/
          {validation.requiredByDifficulty["Nâng cao"]}
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
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, #f0edee ${percent}%, #f0edee 100%)`,
        }}
        type="range"
        value={percent}
      />
    </div>
  );
}
