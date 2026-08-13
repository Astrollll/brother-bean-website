import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [tailwind(), react(), sitemap()],
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: { enabled: true },
  }),
  site: "https://brother-bean-website.pages.dev",
});
