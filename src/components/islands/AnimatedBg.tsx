/* AnimatedBg.tsx — fixed background layer. Mode `auto` follows the theme
   (dark → aurora, light → mesh) and swaps live when the visitor toggles the
   theme; explicit aurora/mesh/grid/none are honored as-is. Off under
   reduced-motion or when animations are disabled. */
import { useEffect, useState } from 'react';
import { resolveAnimatedBg, type AnimatedBg as Mode, type ThemeName } from '../../lib/theme';

interface Props {
  /** raw configured mode from settings — may be 'auto' */
  mode?: Mode;
}

function currentTheme(): ThemeName {
  const t = document.body.dataset.theme;
  return t === 'dark' || t === 'editorial' ? t : 'minimal';
}

export default function AnimatedBg({ mode = 'auto' }: Props) {
  const [resolved, setResolved] = useState<Exclude<Mode, 'auto'>>('mesh');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animsOff = document.body.dataset.animations === 'false';
    setEnabled(!reduce && !animsOff);

    const recompute = () => setResolved(resolveAnimatedBg(currentTheme(), mode));
    recompute();

    // re-resolve when the theme changes (only matters for `auto`)
    const observer = new MutationObserver(recompute);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('themechange', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', recompute);
    };
  }, [mode]);

  if (!enabled || resolved === 'none') return null;

  return (
    <div className="bg-fx" aria-hidden="true">
      {resolved === 'aurora' && (
        <>
          <span className="bg-blob a" />
          <span className="bg-blob b" />
          <span className="bg-blob c" />
        </>
      )}
      {resolved === 'mesh' && <span className="bg-mesh" />}
      {resolved === 'grid' && <span className="bg-grid" />}
    </div>
  );
}
