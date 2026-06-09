import { LANDING_SITEMAP_PATHS } from "~/features/welcome/constants/landing-seo";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function loader({ request }: { request: Request }) {
  const origin = new URL(request.url).origin;
  const updatedAt = new Date().toISOString();
  const entries = LANDING_SITEMAP_PATHS.map((path) => {
    const url = `${origin}${path}`;

    return [
      "  <url>",
      `    <loc>${escapeXml(url)}</loc>`,
      `    <lastmod>${updatedAt}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      path === "/" ? "    <priority>1.0</priority>" : "    <priority>0.7</priority>",
      "  </url>",
    ].join("\n");
  }).join("\n");

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
  ].join("\n");

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
