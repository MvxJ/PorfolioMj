/* TiltCard.tsx — 3D perspective tilt on pointer move, only when body[data-hover]
   is 'tilt'. Wraps server-rendered children (passed via slot as innerHTML host). */
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  max?: number;
}

export default function TiltCard({ children, max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.body.dataset.hover !== 'tilt') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    function onMove(e: PointerEvent) {
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      });
    }
    function reset() {
      if (!el) return;
      cancelAnimationFrame(raf);
      el.style.transform = '';
    }
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform .2s ease';
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={ref} className="tilt-card">
      {children}
    </div>
  );
}
