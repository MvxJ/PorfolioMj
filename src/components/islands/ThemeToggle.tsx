/* ThemeToggle.tsx — flips minimal⇄dark with a View Transitions circular wipe
   (clip-path ripple fallback for Safari/Firefox). Persists to localStorage.theme. */
import { useEffect, useRef, useState } from 'react';
import { SunIcon, MoonIcon } from './icons';

type Theme = 'minimal' | 'dark' | 'editorial';

interface Props {
  label?: string;
}

export default function ThemeToggle({ label = 'Toggle theme' }: Props) {
  const [theme, setTheme] = useState<Theme>('minimal');
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = (document.body.dataset.theme as Theme) || 'minimal';
    setTheme(current);
  }, []);

  function applyTheme(next: Theme) {
    document.body.dataset.theme = next;
    // The AnimatedBg island observes data-theme and re-resolves `auto`
    // (dark → aurora, light → mesh) on its own.
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
    setTheme(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }

  function toggle() {
    const next: Theme = theme === 'dark' ? 'minimal' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const btn = btnRef.current;

    if (!reduce && document.startViewTransition && btn) {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const end = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      );
      const transition = document.startViewTransition(() => applyTheme(next));
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 480, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
        );
      });
      return;
    }
    applyTheme(next);
  }

  const isDark = theme === 'dark';
  return (
    <button
      ref={btnRef}
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
