import { Link } from "react-router";

type NotFoundPageProps = {
  title?: string;
  description?: string;
};

export function NotFoundPage({
  title = "404",
  description = "The requested page could not be found.",
}: NotFoundPageProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-margin-mobile py-12 text-on-surface sm:px-margin-desktop">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-[0_18px_48px_rgba(35,39,51,0.08)] sm:p-10">
        <p className="font-serif text-[72px] font-bold leading-none text-primary/15 sm:text-[96px]">
          {title}
        </p>
        <h1 className="mt-2 font-serif text-headline-md font-bold text-primary">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-body-md text-on-surface-variant">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-label-md font-medium text-on-primary transition-opacity hover:opacity-90"
            to="/"
          >
            Về trang chủ
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-outline-variant bg-white px-6 text-label-md font-medium text-primary transition-colors hover:bg-surface-container-low"
            to="/login"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
