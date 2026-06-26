/* i18n/index.ts — UI microcopy dictionaries (Tier A, in code) + helpers.
   Editorial content lives in the CMS (Tier B) — never here. */
import pl from './pl';
import en from './en';
import uk from './uk';

const DICT = { pl, en, uk } as const;

export type Locale = keyof typeof DICT;
export const LOCALES = ['pl', 'en', 'uk'] as const;
export const DEFAULT_LOCALE: Locale = 'pl';

export const LOCALE_NAMES: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
  uk: 'Українська',
};

export const OG_LOCALES: Record<Locale, string> = {
  pl: 'pl_PL',
  en: 'en_US',
  uk: 'uk_UA',
};

export function isLocale(value: string | undefined): value is Locale {
  return value === 'pl' || value === 'en' || value === 'uk';
}

/** Dot-path lookup into a locale dictionary, falling back to PL, then the key. */
export function t(locale: Locale, path: string): string {
  const get = (o: unknown) =>
    path.split('.').reduce<unknown>((a, k) => (a as Record<string, unknown>)?.[k], o);
  const value = get(DICT[locale]) ?? get(DICT[DEFAULT_LOCALE]);
  return typeof value === 'string' ? value : path;
}

/** A bound translator for a single locale: tt('nav.home'). */
export function useT(locale: Locale) {
  return (path: string) => t(locale, path);
}

/** Resolve a localized CMS field, falling back to PL. */
export function localize<T>(
  field: { pl: T; en?: T; uk?: T } | undefined | null,
  locale: Locale,
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field.pl;
}
