/* CountUp.tsx — animates a stat value into view via IntersectionObserver.
   Handles "4+", "30+", "20+" style strings (numeric core + suffix/prefix).
   Static value is the SSR base; only animates when motion ≠ subtle. */
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  duration?: number;
}

function parse(value: string) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
}

export default function CountUp({ value, duration = 1200 }: Props) {
  const parsed = parse(value);
  // SSR / first render show the REAL value (no-JS & SEO safe); animation resets
  // to 0 and counts up only after mount when in view.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!parsed) {
      setDisplay(value);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    setDisplay(`${parsed.prefix}0${parsed.suffix}`);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              const current = Math.round(parsed.num * eased);
              setDisplay(`${parsed.prefix}${current}${parsed.suffix}`);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
