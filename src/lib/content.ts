/* content.ts — typed getters over the content collections + localized access.
   Replaces the prototype's loc() / useT() data access. */
import { getCollection, getEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { localize } from '../i18n';
import { DEFAULT_APPEARANCE, type Appearance } from './theme';
import { showPlaceholders } from './env';

export { localize };

/** Drop placeholder/seed entries when ENV=prod; keep all in review/dev. */
const notPlaceholder = (e: { data: { placeholder?: boolean } }) =>
  showPlaceholders || !e.data.placeholder;

/* ------------------------------ settings -------------------------------- */
export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  return entry?.data;
}

export async function getAppearance(): Promise<Appearance> {
  const s = await getSettings();
  return { ...DEFAULT_APPEARANCE, ...(s?.appearance ?? {}) };
}

export async function getSite() {
  const s = await getSettings();
  return s?.site;
}

export async function getSeoDefaults() {
  const s = await getSettings();
  return s?.seo;
}

/* ------------------------------ singletons ------------------------------ */
export async function getHero() {
  return (await getEntry('hero', 'hero'))?.data;
}
export async function getAbout() {
  return (await getEntry('about', 'about'))?.data;
}
export async function getContact() {
  return (await getEntry('contact', 'contact'))?.data;
}

/* ------------------------------ collections ----------------------------- */
const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

export async function getProjects() {
  return (await getCollection('projects')).filter(notPlaceholder).sort(byOrder);
}
export async function getProject(slug: string) {
  return getEntry('projects', slug);
}
export async function getExperience() {
  return (await getCollection('experience')).filter(notPlaceholder).sort(byOrder);
}
export async function getEducation() {
  return (await getCollection('education')).filter(notPlaceholder).sort(byOrder);
}
export async function getCerts() {
  return (await getCollection('certs')).filter(notPlaceholder).sort(byOrder);
}
export async function getTech() {
  return (await getCollection('tech')).sort(byOrder);
}

/** Look up a single tech entry by its display name (case-insensitive). */
export async function getTechByName(name: string) {
  const all = await getTech();
  return all.find((t) => t.data.name.toLowerCase() === name.toLowerCase());
}

/** Group tech entries by category for the Skills section. */
export async function getTechByCategory() {
  const all = await getTech();
  const cats = ['backend', 'frontend', 'database', 'tools'] as const;
  return cats.map((category) => ({
    category,
    items: all.filter((t) => t.data.category === category),
  }));
}

/* ----------------------------- localized arrays -------------------------
   Tolerant of every shape the content can take:
   1. a list of per-item translations — [{ pl, en, uk }, …] (current CMS shape)
   2. a plain, un-localized list of strings — ["…", …]
   3. a legacy per-locale record of lists — { pl: […], en: […], uk: […] }
   Always returns the strings for `locale`, falling back per item to pl/en/uk. */
type LocItem = { pl?: string; en?: string; uk?: string };
type LocArr = string[] | LocItem[] | { pl?: string[]; en?: string[]; uk?: string[] };

export function localizeArr(field: LocArr | undefined | null, locale: Locale): string[] {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field
      .map((item) => {
        if (typeof item === 'string') return item;
        return item[locale] ?? item.pl ?? item.en ?? item.uk ?? '';
      })
      .filter((v) => v !== '');
  }
  return field[locale] ?? field.pl ?? field.en ?? field.uk ?? [];
}
