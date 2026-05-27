import type { ReactNode } from "react";

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
      <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-lg border-outline-variant bg-surface-container-low"
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
      <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-lg border-outline-variant bg-surface-container-low"
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
      <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <select
        className="mt-2 w-full rounded-lg border-outline-variant bg-surface-container-low"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
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
    <label className="flex items-center justify-between gap-sm rounded-xl bg-surface-container-low px-sm py-3">
      <span className="font-semibold text-primary">{label}</span>
      <input
        checked={value}
        className="rounded border-outline-variant text-secondary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}
