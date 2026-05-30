export function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-sm">
      <strong className="block text-headline-md text-primary">{value}</strong>
      <span className="text-label-sm font-semibold text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}
