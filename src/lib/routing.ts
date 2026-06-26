/* routing.ts — locale path helpers + hreflang alternates. */
import type { Locale } from '../i18n';
import { LOCALES } from '../i18n';

const LOCALE_RE = /^\/(pl|en|uk)(?=\/|$)/;

/** Prefix a clean path (e.g. "/about" or "") with the locale: "/en/about". */
export function localizedPath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** Swap the leading locale segment of a full pathname to another locale. */
export function swapLocale(pathname: string, to: Locale): string {
  if (LOCALE_RE.test(pathname)) return pathname.replace(LOCALE_RE, `/${to}`);
  return localizedPath(to, pathname);
}

/** Strip the locale prefix, returning the bare path ("/about", or "" for home). */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(LOCALE_RE, '');
  return stripped.replace(/^\/+/, '').replace(/\/+$/, '');
}

/** Detect the locale from a pathname; defaults to 'pl'. */
export function localeFromUrl(pathname: string): Locale {
  const m = pathname.match(LOCALE_RE);
  return (m?.[1] as Locale) ?? 'pl';
}

/** Build absolute hreflang alternates for a bare path. */
export function alternatesFor(site: string, barePath = '') {
  const origin = site.replace(/\/+$/, '');
  return LOCALES.map((locale) => ({
    locale,
    href: `${origin}${localizedPath(locale, barePath)}`,
  }));
}
