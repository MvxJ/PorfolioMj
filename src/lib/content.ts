/* content.ts — typed getters over the content collections + localized access.
   Replaces the prototype's loc() / useT() data access. */
import { getCollection, getEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { localize } from '../i18n';
import { DEFAULT_APPEARANCE, type Appearance } from './theme';

export { localize };

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
  return (await getCollection('projects')).sort(byOrder);
}
export async function getProject(slug: string) {
  return getEntry('projects', slug);
}
export async function getExperience() {
  return (await getCollection('experience')).sort(byOrder);
}
export async function getEducation() {
  return (await getCollection('education')).sort(byOrder);
}
export async function getCerts() {
  return (await getCollection('certs')).sort(byOrder);
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
   Tolerant of both a plain T[] and a { pl, en, uk } object of arrays. */
export function localizeArr<T>(
  field: T[] | { pl?: T[]; en?: T[]; uk?: T[] } | undefined | null,
  locale: Locale,
): T[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return field[locale] ?? field.pl ?? field.en ?? field.uk ?? [];
}
