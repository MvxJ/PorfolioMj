/* ThemeToggle.tsx — pill switch that flips minimal⇄dark with a View Transitions
   circular wipe (clip-path ripple fallback for Safari/Firefox). Reads the theme
   already applied to <body> by the pre-paint script in BaseLayout, so it renders
   in the correct position with NO animation on load (transitions are enabled one
   frame after mount). Persists to localStorage.theme. */
import { useEffect, useRef, useState } from 'react';
import { SunIcon, MoonIcon } from './icons';

type Theme = 'minimal' | 'dark' | 'editorial';

interface Props {
  label?: string;
}

export default function ThemeToggle({ label = 'Toggle theme' }: Props) {
  const [theme, setTheme] = useState<Theme>('minimal');
  // Gates the CSS transition — off until one frame after mount so syncing the
  // knob to the persisted theme doesn't animate on every page navigation.
  const [ready, setReady] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = (document.body.dataset.theme as Theme) || 'minimal';
    setTheme(current);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
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
      className={`theme-switch ${ready ? 'is-ready' : ''}`.trim()}
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
    >
      <span className="theme-switch-knob">
        {isDark ? <MoonIcon size={13} /> : <SunIcon size={14} />}
      </span>
    </button>
  );
}
