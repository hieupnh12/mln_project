type BrandLogoProps = {
  className?: string;
  size?: "default" | "large";
};

export function BrandLogo({
  className = "",
  size = "default",
}: BrandLogoProps) {
  const imageClassName = size === "large" ? "h-20 w-20" : "h-14 w-14";
  const textClassName =
    size === "large" ? "text-[30px] sm:text-[36px]" : "text-xl sm:text-2xl";

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <img
        alt=""
        aria-hidden="true"
        className={`${imageClassName} shrink-0 object-contain`}
        src="/ml_logo.png"
      />
      <span
        className={`${textClassName} whitespace-nowrap font-bold leading-none text-[#d60000]`}
      >
        ML Learning
      </span>
    </span>
  );
}
