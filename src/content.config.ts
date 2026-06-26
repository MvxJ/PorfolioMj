/* content.config.ts — Astro collections + Zod schemas.
   Keep in lockstep with public/admin/config.yml (Sveltia). If you add a field
   in one, add it in the other. */
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { file, glob } from 'astro/loaders';

/* ----------------------------- shared shapes ---------------------------- */
const i18nStr = z.object({
  pl: z.string(),
  en: z.string().optional(),
  uk: z.string().optional(),
});
const i18nArr = z.object({
  pl: z.array(z.string()),
  en: z.array(z.string()).optional(),
  uk: z.array(z.string()).optional(),
});
const base = z.object({
  order: z.number().default(0),
});

/* Singleton files store one flat object (what Sveltia writes). Wrap it as a
   single entry keyed by `id` so getEntry(collection, id) resolves it. */
const single = (id: string) => ({
  parser: (text: string) => ({ [id]: JSON.parse(text) }),
});

/* ------------------------------- singletons ----------------------------- */
const settings = defineCollection({
  loader: file('src/content/settings.json', single('settings')),
  schema: z.object({
    appearance: z.object({
      theme: z.enum(['minimal', 'dark', 'editorial']).default('minimal'),
      accent: z.string().default('#6366f1'),
      fontPairing: z.enum(['grotesk', 'mono', 'serif', 'bold']).default('mono'),
      animations: z.boolean().default(true),
      animStyle: z.enum(['subtle', 'energetic', 'playful']).default('energetic'),
      hoverEffect: z.enum(['none', 'lift', 'tilt', 'glow']).default('tilt'),
      animatedBg: z.enum(['auto', 'none', 'aurora', 'mesh', 'grid']).default('auto'),
      defaultLanguage: z.enum(['pl', 'en', 'uk']).default('pl'),
    }),
    site: z.object({
      name: z.string(),
      role: i18nStr,
      domain: z.string(),
      email: z.string(),
      socials: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    }),
    seo: z.object({
      defaultTitle: i18nStr,
      defaultDescription: i18nStr,
      ogImage: z.string().default('/assets/images/og-default.png'),
    }),
  }),
});

const hero = defineCollection({
  loader: file('src/content/hero.json', single('hero')),
  schema: z.object({
    greeting: i18nStr,
    role: i18nStr,
    tagline: i18nStr,
    ctaProjects: i18nStr,
    ctaContact: i18nStr,
  }),
});

const about = defineCollection({
  loader: file('src/content/about.json', single('about')),
  schema: z.object({
    bio: i18nStr,
    locationValue: i18nStr,
    photo: z.string().optional(),
    stats: z.array(z.object({ value: z.string(), label: i18nStr })).default([]),
  }),
});

const contact = defineCollection({
  loader: file('src/content/contact.json', single('contact')),
  schema: z.object({
    intro: i18nStr,
  }),
});

/* ------------------------------ collections ----------------------------- */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: base.extend({
    title: i18nStr,
    year: z.string(),
    role: i18nStr,
    desc: i18nStr,
    accent: z.string().default('#6366f1'),
    tech: z.array(z.string()).default([]),
    cover: z.string(),
    gallery: z.array(z.string()).default([]),
    highlights: i18nArr,
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: base.extend({
    company: z.string(),
    logo: z.string().optional(),
    initials: z.string(),
    color: z.string().default('#6366f1'),
    from: z.string(),
    to: z.string().nullable().optional(),
    location: z.string(),
    type: z.enum(['fullTime', 'partTime', 'contract']),
    tech: z.array(z.string()).default([]),
    position: i18nStr,
    shortDesc: i18nStr,
    fullDesc: i18nStr,
    achievements: i18nArr,
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/education' }),
  schema: base.extend({
    year: z.string(),
    degree: i18nStr,
    institution: i18nStr,
    desc: i18nStr,
  }),
});

const certs = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/certs' }),
  schema: base.extend({
    name: z.string(),
    year: z.string(),
  }),
});

const tech = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/tech' }),
  schema: base.extend({
    name: z.string(),
    color: z.string().default('#6366f1'),
    fg: z.string().default('#ffffff'),
    abbr: z.string(),
    category: z.enum(['backend', 'frontend', 'database', 'tools']),
    logo: z.string().nullable().optional(),
  }),
});

export const collections = {
  settings,
  hero,
  about,
  contact,
  projects,
  experience,
  education,
  certs,
  tech,
};
