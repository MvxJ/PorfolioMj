/* TechChips.tsx — renders a project's tech as named chips, capped to `maxRows`
   rows (as many as fit), with a trailing "+N" tile for the overflow. The fit is
   measured client-side (chip widths vary), shrinking the visible count until the
   chips + the "+N" tile settle within maxRows. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface TechItem {
  name: string;
  logo: string | null;
  abbr: string;
  color: string;
  fg: string;
  alt: string;
}
interface Props {
  items: TechItem[];
  maxRows?: number;
}

// useLayoutEffect on the client, no-op fallback during SSR (avoids the warning).
const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Chip({ item }: { item: TechItem }) {
  return (
    <span className="tech-chip">
      {item.logo ? (
        <span className="tech-ico tech-ico--logo" title={item.alt}>
          <img src={item.logo} alt={item.alt} loading="lazy" decoding="async" />
        </span>
      ) : (
        <span
          className="tech-ico"
          title={item.alt}
          style={{ background: item.color, color: item.fg }}
        >
          {item.abbr}
        </span>
      )}
      {item.name}
    </span>
  );
}

export default function TechChips({ items, maxRows = 2 }: Props) {
  const [limit, setLimit] = useState(items.length);
  const ref = useRef<HTMLDivElement>(null);

  // Re-measure from scratch whenever the available width changes.
  useEffect(() => {
    const onResize = () => setLimit(items.length);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [items.length]);

  // Shrink one chip at a time until everything (incl. the "+N" tile) fits maxRows.
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    if (kids.length === 0) return;
    const rows = new Set(kids.map((k) => k.offsetTop));
    if (rows.size > maxRows && limit > 1) {
      setLimit((l) => Math.max(1, l - 1));
    }
  }, [limit, items, maxRows]);

  const hidden = items.length - limit;
  const shown = items.slice(0, limit);

  return (
    <div className="project-card-tech" ref={ref}>
      {shown.map((item) => (
        <Chip key={item.name} item={item} />
      ))}
      {hidden > 0 && <span className="tech-chip tech-chip--more">+{hidden}</span>}
    </div>
  );
}
