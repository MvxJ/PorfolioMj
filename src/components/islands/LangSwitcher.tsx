/* LangSwitcher.tsx — flag dropdown that navigates to the SAME page in the
   chosen locale (swaps the leading /pl|/en|/uk segment). */
import { useEffect, useRef, useState } from 'react';
import { ChevronIcon } from './icons';

type Locale = 'pl' | 'en' | 'uk';

interface Props {
  current: Locale;
  label?: string;
  flags: Record<Locale, string>; // inline SVG markup per locale
  names: Record<Locale, string>;
}

const ORDER: Locale[] = ['pl', 'en', 'uk'];

function swapLocale(pathname: string, to: Locale): string {
  const re = /^\/(pl|en|uk)(?=\/|$)/;
  if (re.test(pathname)) return pathname.replace(re, `/${to}`);
  return `/${to}${pathname}`;
}

export default function LangSwitcher({ current, label = 'Change language', flags, names }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function go(to: Locale) {
    try {
      localStorage.setItem('lang', to);
    } catch {
      /* ignore */
    }
    const target = swapLocale(window.location.pathname, to);
    window.location.href = target;
  }

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flag" dangerouslySetInnerHTML={{ __html: flags[current] }} />
        <span>{current.toUpperCase()}</span>
        <ChevronIcon className="chevron" />
      </button>
      {open && (
        <div className="lang-menu" role="menu">
          {ORDER.map((loc) => (
            <a
              key={loc}
              role="menuitem"
              href={swapLocale(window.location.pathname, loc)}
              aria-current={loc === current ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(loc);
              }}
            >
              <span className="flag" dangerouslySetInnerHTML={{ __html: flags[loc] }} />
              <span>{names[loc]}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
