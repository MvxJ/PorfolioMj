/* seo.ts — meta builder + JSON-LD constructors. Rendered by BaseLayout. */
import type { Locale } from '../i18n';
import { OG_LOCALES } from '../i18n';
import { alternatesFor } from './routing';

export interface SeoInput {
  title: string;
  description: string;
  /** bare path without locale prefix, e.g. "about" or "" for home */
  barePath?: string;
  locale: Locale;
  site: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

export interface SeoData extends Required<Omit<SeoInput, 'ogImage' | 'noindex'>> {
  canonical: string;
  ogImageAbs: string;
  alternates: { locale: Locale; href: string }[];
  ogLocale: string;
  ogLocaleAlternates: string[];
  noindex: boolean;
}

export function buildSeo(input: SeoInput): SeoData {
  const origin = input.site.replace(/\/+$/, '');
  const barePath = input.barePath ?? '';
  const alternates = alternatesFor(origin, barePath);
  const canonical =
    alternates.find((a) => a.locale === input.locale)?.href ?? origin;
  const ogImage = input.ogImage ?? '/assets/images/og-default.png';
  const ogImageAbs = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;
  return {
    title: input.title,
    description: input.description,
    barePath,
    locale: input.locale,
    site: origin,
    type: input.type ?? 'website',
    canonical,
    ogImageAbs,
    alternates,
    ogLocale: OG_LOCALES[input.locale],
    ogLocaleAlternates: Object.entries(OG_LOCALES)
      .filter(([l]) => l !== input.locale)
      .map(([, v]) => v),
    noindex: input.noindex ?? false,
  };
}

/* ------------------------------- JSON-LD -------------------------------- */
interface PersonArgs {
  name: string;
  jobTitle: string;
  url: string;
  email?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  alumniOf?: string[];
}

export function personLd(a: PersonArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: a.name,
    jobTitle: a.jobTitle,
    url: a.url,
    ...(a.email ? { email: `mailto:${a.email}` } : {}),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Warsaw',
      addressCountry: 'PL',
    },
    knowsLanguage: ['pl', 'en', 'uk'],
    ...(a.knowsAbout?.length ? { knowsAbout: a.knowsAbout } : {}),
    ...(a.alumniOf?.length
      ? { alumniOf: a.alumniOf.map((n) => ({ '@type': 'EducationalOrganization', name: n })) }
      : {}),
  };
}

export function websiteLd(name: string, url: string, locale: Locale, personUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    inLanguage: locale,
    publisher: { '@type': 'Person', name, url: personUrl },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

interface CreativeWorkArgs {
  name: string;
  description: string;
  keywords: string[];
  dateCreated: string;
  url: string;
  image?: string;
  authorName: string;
  authorUrl: string;
}

export function creativeWorkLd(a: CreativeWorkArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: a.name,
    description: a.description,
    keywords: a.keywords.join(', '),
    dateCreated: a.dateCreated,
    url: a.url,
    ...(a.image ? { image: a.image } : {}),
    author: { '@type': 'Person', name: a.authorName, url: a.authorUrl },
  };
}

export function itemListLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}
