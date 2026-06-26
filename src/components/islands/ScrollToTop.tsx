/* ScrollToTop.tsx — appears after 600px of scroll; smooth-scrolls to top. */
import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './icons';

interface Props {
  label?: string;
}

export default function ScrollToTop({ label = 'Back to top' }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      className={`scroll-top ${show ? 'show' : ''}`}
      onClick={toTop}
      aria-label={label}
      title={label}
      tabIndex={show ? 0 : -1}
    >
      <ArrowUpIcon />
    </button>
  );
}
