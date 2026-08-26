// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// The canonical production origin. Used for sitemap, canonical URLs and hreflang.
// Change this to the real domain once it is registered.
const SITE = 'https://maks.dev';

// This is a 100% static site (output: 'static'). No SSR adapter is needed —
// `astro build` emits plain files to `dist/`, which Cloudflare serves directly
// (wrangler.jsonc → assets.directory: "./dist"). Adding @astrojs/cloudflare
// would force pages through the workerd runtime even in `astro dev`, which a
// pure SSG site does not need.
// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  i18n: {
    locales: ['pl', 'en', 'uk'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      // "/" renders the EN homepage itself (src/pages/index.astro) — no redirect.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { pl: 'pl-PL', en: 'en', uk: 'uk-UA' },
      },
    }),
  ],
});
