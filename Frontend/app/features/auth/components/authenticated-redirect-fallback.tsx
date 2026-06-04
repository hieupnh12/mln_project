import { Link } from "react-router";

type AuthenticatedRedirectFallbackProps = {
  redirectPath: string;
};

export function AuthenticatedRedirectFallback({
  redirectPath,
}: AuthenticatedRedirectFallbackProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-margin-mobile text-on-surface">
      <div className="w-full max-w-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md text-center shadow-[0_12px_30px_rgba(35,39,51,0.06)]">
        <p className="text-label-md font-medium text-on-surface-variant">
          Đang mở khu học tập...
        </p>
        <Link
          className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary transition hover:opacity-90 active:scale-95"
          to={redirectPath}
        >
          Vào khu học tập
        </Link>
      </div>
    </main>
  );
}
