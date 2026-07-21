import { getPublicOrigin } from "~/shared/utils/public-origin";

export function loader({ request }: { request: Request }) {
  const origin = getPublicOrigin(request);
  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
