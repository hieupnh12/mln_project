import { LANDING_VISUAL_ASSETS } from "./landing-visual";

export const LANDING_ASSETS = {
  heroWebp: "/images/marx-lenin-hero.webp",
  heroPng: "/images/marx-lenin-hero.png",
} as const;

export const LANDING_SEO = {
  title: "Mác - Lê Nin | Tri thức - Lịch sử - Cách mạng",
  description:
    "Landing page giới thiệu dự án Mác - Lê Nin: nền tảng học tập lịch sử, lý luận, quiz, chatbot AI, tài liệu và timeline tương tác cho sinh viên.",
  keywords:
    "Mác Lê Nin, Marxism Leninism, chủ nghĩa Mác Lê Nin, học tập chính trị, lịch sử cách mạng, quiz Mác Lê Nin, chatbot AI giáo dục",
  siteName: "Mác - Lê Nin",
  siteOrigin: "https://hocllct.io.vn",
  locale: "vi_VN",
} as const;

export const LANDING_SITEMAP_PATHS = ["/", "/login"] as const;

type JsonLdPrimitive = string | number | boolean | null;
type JsonLdValue = JsonLdPrimitive | JsonLdValue[] | { [key: string]: JsonLdValue };

export type JsonLdObject = {
  [key: string]: JsonLdValue;
};

export function getCanonicalUrl(origin = LANDING_SEO.siteOrigin) {
  return `${origin.replace(/\/$/, "")}/`;
}

export function landingMeta(canonicalUrl = getCanonicalUrl()) {
  return [
    { title: LANDING_SEO.title },
    { name: "description", content: LANDING_SEO.description },
    { name: "keywords", content: LANDING_SEO.keywords },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { name: "author", content: LANDING_SEO.siteName },
    { property: "og:type", content: "website" },
    { property: "og:title", content: LANDING_SEO.title },
    { property: "og:description", content: LANDING_SEO.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: LANDING_SEO.siteName },
    { property: "og:locale", content: LANDING_SEO.locale },
    { property: "og:image", content: `${canonicalUrl.replace(/\/$/, "")}${LANDING_ASSETS.heroWebp}` },
    { property: "og:image:alt", content: "Không gian học tập lịch sử cinematic cho dự án Mác - Lê Nin" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: LANDING_SEO.title },
    { name: "twitter:description", content: LANDING_SEO.description },
    { name: "twitter:image", content: `${canonicalUrl.replace(/\/$/, "")}${LANDING_ASSETS.heroWebp}` },
  ];
}

export function landingLinks() {
  return [
    { rel: "preload", href: LANDING_VISUAL_ASSETS.modernHeroWebp, as: "image", type: "image/webp" },
  ];
}

export function createLandingJsonLd(canonicalUrl = getCanonicalUrl()): JsonLdObject {
  const imageUrl = `${canonicalUrl.replace(/\/$/, "")}${LANDING_ASSETS.heroWebp}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl}#website`,
        name: LANDING_SEO.siteName,
        url: canonicalUrl,
        inLanguage: "vi",
        description: LANDING_SEO.description,
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${canonicalUrl}#organization`,
        name: LANDING_SEO.siteName,
        url: canonicalUrl,
        logo: imageUrl,
      },
      {
        "@type": "Course",
        "@id": `${canonicalUrl}#course`,
        name: "Mác - Lê Nin",
        description: LANDING_SEO.description,
        provider: {
          "@id": `${canonicalUrl}#organization`,
        },
        educationalLevel: "University",
        inLanguage: "vi",
      },
    ],
  };
}
