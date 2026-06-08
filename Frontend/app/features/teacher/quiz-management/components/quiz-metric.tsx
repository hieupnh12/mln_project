export function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-outline-variant/10 bg-white px-sm py-2 text-center">
      <strong className="block text-headline-md font-semibold text-primary">{value}</strong>
      <span className="text-label-sm text-on-surface-variant">{label}</span>
    </div>
  );
}
