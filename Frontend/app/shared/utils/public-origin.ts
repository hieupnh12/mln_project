import { LANDING_SEO } from "~/features/welcome/constants/landing-seo";

/**
 * Prefer the public HTTPS origin when the app sits behind a reverse proxy
 * that forwards HTTP to the Node server.
 */
export function getPublicOrigin(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    const proto = forwardedProto === "http" || forwardedProto === "https" ? forwardedProto : "https";
    return `${proto}://${forwardedHost}`.replace(/\/$/, "");
  }

  const requestOrigin = new URL(request.url).origin;
  if (requestOrigin.startsWith("https://")) {
    return requestOrigin.replace(/\/$/, "");
  }

  return LANDING_SEO.siteOrigin.replace(/\/$/, "");
}
