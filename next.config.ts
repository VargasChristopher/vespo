import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  /* Static HTML export → GitHub Pages, which only serves files. Every route
     here is already prerendered (no API routes, no dynamic segments), so
     nothing is lost by dropping the Node server. */
  output: "export",

  /* Next's image optimizer needs a server. Our images are five small logo
     PNGs plus the OG card, so serving them as-is costs nothing. */
  images: { unoptimized: true },

  /* Emit /services/index.html rather than /services.html, so GitHub Pages
     resolves bare paths without a server-side rewrite. */
  trailingSlash: true,

  /* NOTE: `redirects()` does NOT run under `output: "export"` — there is no
     server to issue the 308. These three legacy paths are now handled as
     Cloudflare Redirect Rules instead (Rules → Redirect Rules on vespo.io):
       /pricing        → /contact   (301)
       /roi-calculator → /contact   (301)
       /free-audit     → /contact   (301)
     Keep this list and the Cloudflare rules in sync. */
};

export default nextConfig;
