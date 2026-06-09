type GoogleLoginButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

function GoogleIcon() {
  return (
    <span
      aria-hidden="true"
      className="font-sans text-base font-bold leading-none text-landing-text sm:text-lg"
    >
      G
    </span>
  );
}

export function GoogleLoginButton({ isLoading, onClick }: GoogleLoginButtonProps) {
  return (
    <button
      className="landing-glow-button grid min-h-14 w-full grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-3 rounded-full bg-gradient-to-r from-landing-red via-landing-red-deep to-landing-red-dark px-5 py-3 text-label-md font-semibold text-on-primary shadow-xl shadow-landing-red/20 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-landing-red/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-16 sm:grid-cols-[28px_minmax(0,1fr)_28px] sm:text-base"
      disabled={isLoading}
      onClick={onClick}
      type="button"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-landing-white shadow-sm sm:h-10 sm:w-10">
        <GoogleIcon />
      </span>
      <span className="min-w-0 truncate text-center">
        {isLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
      </span>
      <span aria-hidden="true" />
    </button>
  );
}
