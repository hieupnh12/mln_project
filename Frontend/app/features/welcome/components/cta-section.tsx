import { ArrowRight, ShieldCheck } from "lucide-react";

import { MagneticButton } from "./magnetic-button";
import { Reveal } from "./reveal";

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-landing-white px-margin-mobile py-16 text-landing-text md:px-margin-desktop md:py-xl"
      id="cta"
    >
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-landing-red/10 blur-3xl" />
      <Reveal className="landing-glass-panel relative mx-auto max-w-5xl rounded-[2rem] p-7 text-center sm:p-10 md:p-14">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-landing-red/10 bg-landing-red/5 px-4 py-2 text-landing-red">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          <span className="font-label-sm text-label-sm uppercase">Protected system</span>
        </div>
        <h2 id="cta-title" className="font-serif text-4xl font-bold leading-tight text-landing-text sm:text-[56px]">
          Đăng nhập để bắt đầu học tập
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-body-lg text-landing-text-soft">
          Người dùng sau khi xác thực sẽ được điều hướng đến dashboard phù hợp:
          sinh viên, giảng viên hoặc quản trị viên.
        </p>
        <MagneticButton
          className="landing-glow-button mt-9 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-landing-red to-landing-red-deep px-7 py-3 font-label-md text-label-md font-semibold text-on-primary"
          to="/login"
        >
          Đăng nhập hệ thống
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </MagneticButton>
      </Reveal>
    </section>
  );
}
