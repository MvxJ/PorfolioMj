/* env.ts — deployment environment flag.
 *
 * Set the `ENV` build variable in Cloudflare Pages:
 *   - Production environment  → ENV = prod    (hides placeholder/seed content)
 *   - Preview environment     → ENV = review  (shows everything, for previewing)
 *
 * Locally (unset) it defaults to `review`, so you always see all content in dev.
 * Read from process.env (build-time, SSG) with an import.meta.env fallback. */
const fromProcess =
  typeof process !== 'undefined' && process.env ? process.env.ENV : undefined;
const fromImportMeta = (import.meta.env as Record<string, string | undefined>).ENV;
const raw = fromProcess ?? fromImportMeta ?? 'review';

export type DeployEnv = 'prod' | 'review';
export const ENV: DeployEnv = raw === 'prod' ? 'prod' : 'review';
export const isProd = ENV === 'prod';

/** In prod we hide entries flagged `placeholder: true`; review shows them. */
export const showPlaceholders = !isProd;
