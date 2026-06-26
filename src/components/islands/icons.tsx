/* icons.tsx — minimal inline SVG icons for React islands (can't import .astro Icon). */
import type { CSSProperties } from 'react';

interface P {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function SunIcon({ size = 18, className, style }: P) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9L13 13M13 3l-1.1 1.1M4.1 11.9L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MoonIcon({ size = 18, className, style }: P) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.5 9.6A5.6 5.6 0 016.4 2.5a.6.6 0 00-.8-.8 6.8 6.8 0 108.7 8.7.6.6 0 00-.8-.8z" />
    </svg>
  );
}

export function ChevronIcon({ size = 14, className, style }: P) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 20, className, style }: P) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 14.5V4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9l5-5 5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
