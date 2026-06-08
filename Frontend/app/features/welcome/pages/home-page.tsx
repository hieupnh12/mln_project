import { CtaSection } from "../components/cta-section";
import { FeaturesPreviewSection } from "../components/features-preview-section";
import { HeroSection } from "../components/hero-section";
import { IntroductionSection } from "../components/introduction-section";
import { LandingFooter } from "../components/landing-footer";
import { LandingNavbar } from "../components/landing-navbar";
import { QuoteSection } from "../components/quote-section";
import { StatisticsSection } from "../components/statistics-section";
import { TimelineSection } from "../components/timeline-section";
import { createLandingJsonLd, landingMeta } from "../constants/landing-seo";

type HomePageProps = {
  canonicalUrl?: string;
};

export function meta({ canonicalUrl }: HomePageProps = {}) {
  return landingMeta(canonicalUrl);
}

export function HomePage({ canonicalUrl }: HomePageProps) {
  const jsonLd = createLandingJsonLd(canonicalUrl);

  return (
    <div className="min-h-screen bg-landing-white text-landing-text selection:bg-landing-red selection:text-on-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        className="sr-only z-[60] rounded-lg bg-landing-gold px-4 py-2 text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Bỏ qua điều hướng
      </a>
      <LandingNavbar />
      <main id="main-content">
        <HeroSection />
        <IntroductionSection />
        <TimelineSection />
        <FeaturesPreviewSection />
        <StatisticsSection />
        <QuoteSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
