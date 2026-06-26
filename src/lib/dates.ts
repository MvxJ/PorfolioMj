/* dates.ts — locale-aware month abbreviations + date formatting for experience. */
import type { Locale } from '../i18n';

export const MONTHS: Record<Locale, string[]> = {
  pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  uk: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
};

/** Format a "YYYY-MM" string as e.g. "sty 2024". Returns '' for empty input. */
export function fmtDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return '';
  const [y, m] = value.split('-');
  const month = Number(m);
  if (!y || !month || month < 1 || month > 12) return value;
  return `${MONTHS[locale][month - 1]} ${y}`;
}
