type AdminOnlineBadgeProps = {
  online: boolean;
  lastSeenAt: string | null;
};

export function AdminOnlineBadge({ online, lastSeenAt }: AdminOnlineBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={
          online
            ? "h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_0_3px_rgba(191,232,230,0.55)]"
            : "h-2.5 w-2.5 rounded-full bg-outline-variant"
        }
      />
      <span className="text-label-sm font-medium text-on-surface">
        {online ? "Online" : "Offline"}
      </span>
      {!online && lastSeenAt ? (
        <span className="sr-only">Lần cuối hoạt động: {lastSeenAt}</span>
      ) : null}
    </span>
  );
}
