import type { ReactNode } from "react";

const fieldLabelClass =
  "text-label-sm font-medium text-on-surface-variant";
const fieldInputClass =
  "mt-1 w-full rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-body-md text-primary transition focus:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/15";

export function TextInput({
  label,
  onChange,
  placeholder = "",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        className={fieldInputClass}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

export function NumberInput({
  label,
  min = 0,
  onChange,
  value,
}: {
  label: string;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        className={fieldInputClass}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

export function SelectInput({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <select
        className={fieldInputClass}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

export function DateTimeInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        className={fieldInputClass}
        onChange={(event) => onChange(event.target.value)}
        type="datetime-local"
        value={value}
      />
    </label>
  );
}

export function ToggleInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-sm rounded-lg border border-outline-variant/15 bg-white px-sm py-2 transition hover:border-secondary/30">
      <span className="text-label-md font-medium text-primary">{label}</span>
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          checked={value}
          className="peer sr-only"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-outline-variant/40 transition peer-checked:bg-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/25"
        />
        <span
          aria-hidden
          className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4"
        />
      </span>
    </label>
  );
}
