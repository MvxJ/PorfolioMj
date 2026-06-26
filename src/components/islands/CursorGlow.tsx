/* CursorGlow.tsx — accent glow that follows the pointer (rAF). Disabled when
   animations are off, on touch devices, or under reduced-motion. */
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.body.dataset.animations === 'false') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      el?.classList.add('active');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      });
    }
    function onLeave() {
      el?.classList.remove('active');
    }
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
