/* theme.ts — font pairings, appearance types, and runtime token application.
   Ported from the prototype's "Tweaks → settings" mapping (portfolio-app.jsx). */

export type ThemeName = 'minimal' | 'dark' | 'editorial';
export type FontPairing = 'grotesk' | 'mono' | 'serif' | 'bold';
export type AnimStyle = 'subtle' | 'energetic' | 'playful';
export type HoverEffect = 'none' | 'lift' | 'tilt' | 'glow';
export type AnimatedBg = 'auto' | 'none' | 'aurora' | 'mesh' | 'grid';

export interface Appearance {
  theme: ThemeName;
  accent: string;
  fontPairing: FontPairing;
  animations: boolean;
  animStyle: AnimStyle;
  hoverEffect: HoverEffect;
  animatedBg: AnimatedBg;
  defaultLanguage: 'pl' | 'en' | 'uk';
}

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'minimal',
  accent: '#6366f1',
  fontPairing: 'mono',
  animations: true,
  animStyle: 'energetic',
  hoverEffect: 'tilt',
  animatedBg: 'auto',
  defaultLanguage: 'pl',
};

/** display / body font CSS values per pairing (loaded via Google Fonts). */
export const FONT_PAIRINGS: Record<FontPairing, { display: string; body: string }> = {
  grotesk: {
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
  mono: {
    display: "'JetBrains Mono', ui-monospace, monospace",
    body: "'DM Sans', system-ui, sans-serif",
  },
  serif: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Serif 4', Georgia, serif",
  },
  bold: {
    display: "'Syne', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
};

/** The 12 curated accent swatches the prototype exposes in the CMS color widget. */
export const ACCENT_SWATCHES = [
  '#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#14b8a6', '#10b981',
  '#84cc16', '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#d946ef',
];

/** Resolve the effective background. `auto` (the default) follows the theme:
 *  dark → aurora, light → mesh. An explicit mode is always honored. */
export function resolveAnimatedBg(
  theme: ThemeName,
  mode: AnimatedBg,
): Exclude<AnimatedBg, 'auto'> {
  if (mode === 'auto' || !mode) return theme === 'dark' ? 'aurora' : 'mesh';
  return mode;
}

/** Inline style string for the <body>'s font custom properties. */
export function fontVars(pairing: FontPairing): string {
  const f = FONT_PAIRINGS[pairing] ?? FONT_PAIRINGS.mono;
  return `--font-display:${f.display};--font-body:${f.body};`;
}

/** Google Fonts families needed per pairing (JetBrains Mono is always loaded
 *  because --font-mono uses it everywhere). */
const FONT_FAMILIES: Record<FontPairing, string[]> = {
  grotesk: ['Space+Grotesk:wght@400;500;700', 'DM+Sans:wght@400;500;600;700'],
  mono: ['JetBrains+Mono:wght@400;500;700;800', 'DM+Sans:wght@400;500;600;700'],
  serif: ['Playfair+Display:ital,wght@0,400;0,700;1,400;1,700', 'Source+Serif+4:wght@400;500;600;700'],
  bold: ['Syne:wght@400;600;700;800', 'DM+Sans:wght@400;500;600;700'],
};

export function googleFontsHref(pairing: FontPairing): string {
  const families = new Set<string>(FONT_FAMILIES[pairing] ?? FONT_FAMILIES.mono);
  families.add('JetBrains+Mono:wght@400;500;700;800');
  const params = [...families].map((f) => `family=${f}`).join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

/** Body data-* attributes derived from appearance, applied at build time. */
export function bodyAttrs(a: Appearance) {
  return {
    'data-theme': a.theme,
    'data-animations': String(a.animations),
    'data-anim-style': a.animStyle,
    'data-hover': a.hoverEffect,
    'data-anim-bg': resolveAnimatedBg(a.theme, a.animatedBg),
  };
}
