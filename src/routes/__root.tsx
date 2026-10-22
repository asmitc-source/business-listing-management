import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { ThemeProvider, themeBootScript } from "@/components/theme";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import bodyFont from "@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url";
import { SITE } from "@/lib/site";
import { defaultShareImage, shareMeta, INDEXABLE_ROBOTS, SITE_KEYWORDS, orgJsonLd, websiteJsonLd } from "@/lib/seo";
import { deploymentRobotsMeta } from "@/lib/public-host";
import { NotFound } from "@/components/not-found";

export const Route = createRootRoute({
  // Session is resolved client-side via Better Auth useSession (AuthSlot).
  // A root beforeLoad that awaited getSession blocked every soft navigation.
  head: () => {
    const robots = deploymentRobotsMeta() || INDEXABLE_ROBOTS;
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.legalName },
      { name: "description", content: SITE.description },
      { name: "publisher", content: SITE.legalName },
      { name: "application-name", content: SITE.legalName },
      { name: "keywords", content: SITE_KEYWORDS.join(", ") },
      { name: "theme-color", content: "#f4f1ea" },
      { name: "google-site-verification", content: "SANgNulrO0igNLnWomn54tf-G9uZr7EsL01oN56JWwo" },
      ...(robots ? [{ name: "robots", content: robots }] : []),
      ...shareMeta({ title: SITE.name, description: SITE.description, path: "/" }),
    ],
    scripts: [orgJsonLd(), websiteJsonLd()].map(data => ({ type: "application/ld+json", children: JSON.stringify(data).replace(/</g, "\\u003c") })),
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "alternate", type: "application/rss+xml", title: "BLM published articles", href: "/rss.xml" },
      { rel: "alternate", type: "text/plain", title: "BLM machine-readable article index", href: "/llms.txt" },
      { rel: "image_src", href: defaultShareImage() },
      { rel: "stylesheet", href: appCss },
      { rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous", href: bodyFont, fetchPriority: "high" },
    ],
  };
  },
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-rVXcb-PIlrUdaGgQhCqyn.js" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};\n plausible.init()",
          }}
        />
      </head>
      <body className="min-h-svh bg-paper text-ink">
        <AuthProvider>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </AuthProvider>
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}
