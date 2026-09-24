/** Bare production host — the only indexable marketing host. */
export const PRODUCTION_HOST = "businesslistingmanagement.com";
export const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;

export function normalizeHost(host: string | null | undefined): string {
  return (
    String(host || "")
      .split(",")[0]
      ?.trim()
      .split(":")[0]
      ?.toLowerCase() || ""
  );
}

/** Vercel deployment / preview hosts must not be indexed. */
export function isVercelAppHost(host: string | null | undefined): boolean {
  return normalizeHost(host).endsWith(".vercel.app");
}

/** True when this Host should emit Allow + sitemap (production bare domain). */
export function isIndexableMarketingHost(host: string | null | undefined): boolean {
  const h = normalizeHost(host);
  if (!h) return true;
  if (isVercelAppHost(h)) return false;
  if (h === `www.${PRODUCTION_HOST}`) return false;
  return h === PRODUCTION_HOST || h === "localhost" || h === "127.0.0.1";
}

const PRIVATE_PATHS = [
  "/app",
  "/login",
  "/signup",
  "/demo",
  "/trial",
  "/unsubscribe",
  "/admin",
] as const;

/**
 * Retrieval crawlers that should read the public marketing site.
 * Mixed-purpose tokens (Google-Extended, Applebot-Extended) stay allowed;
 * blocking them would also drop retrieval.
 */
const AI_RETRIEVAL_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
] as const;

function robotsAllowGroup(agent: string): string[] {
  return [
    `User-agent: ${agent}`,
    "Allow: /",
    ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
    "",
  ];
}

export function robotsTxtForHost(host: string | null | undefined): string {
  if (!isIndexableMarketingHost(host)) {
    return ["User-agent: *", "Disallow: /", ""].join("\n");
  }
  const groups = [robotsAllowGroup("*")];
  if (normalizeHost(host) === PRODUCTION_HOST) {
    for (const agent of AI_RETRIEVAL_AGENTS) groups.push(robotsAllowGroup(agent));
  }
  return [...groups.flat(), `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`, ""].join("\n");
}

/**
 * Robots meta for non-production Vercel deployments (branch previews).
 * Production custom domains stay indexable; .vercel.app production alias is
 * redirected at the domain layer.
 */
export function deploymentRobotsMeta(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const env = process.env.VERCEL_ENV;
  if (env === "preview" || env === "development") return "noindex, nofollow";
  return undefined;
}
