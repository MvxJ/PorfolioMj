/* Lightbox.tsx — full-screen image viewer for the project page. Wires itself to
   any `[data-lightbox]` trigger rendered by ProjectDetail (index in the attr),
   then shows an overlay with prev/next + keyboard/backdrop/Esc navigation. */
import { useCallback, useEffect, useState } from 'react';

interface Img {
  src: string;
  alt: string;
}
interface Props {
  images: Img[];
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export default function Lightbox({
  images,
  closeLabel = 'Close',
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const count = images.length;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + count) % count)),
    [count],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % count)),
    [count],
  );

  // Wire the server-rendered triggers (hero + gallery images).
  useEffect(() => {
    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-lightbox]'),
    );
    const handlers = triggers.map((el) => {
      const handler = () => {
        const i = Number(el.dataset.lightbox);
        if (!Number.isNaN(i) && i >= 0 && i < count) setIndex(i);
      };
      el.addEventListener('click', handler);
      return { el, handler };
    });
    return () =>
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
  }, [count]);

  // Keyboard nav + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  if (!open || index === null) return null;
  const img = images[index];
  const multi = count > 1;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label={closeLabel}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {multi && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label={prevLabel}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.alt} />
        {multi && (
          <figcaption className="lightbox-count">
            {index + 1} / {count}
          </figcaption>
        )}
      </figure>

      {multi && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label={nextLabel}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
