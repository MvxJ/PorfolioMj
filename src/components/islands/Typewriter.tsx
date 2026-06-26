/* Typewriter.tsx — types out the given text, then optionally a second line.
   Only mounted when motion style is energetic/playful. Falls back to static
   text under reduced-motion (the SSR text is the accessible base). */
import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}

export default function Typewriter({ text, className = '', speed = 55, startDelay = 350 }: Props) {
  // SSR / first client render show the FULL text (content stays in the DOM for
  // no-JS and SEO); the animation only kicks in after mount.
  const [shown, setShown] = useState(text);
  const [done, setDone] = useState(true);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceRef.current) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown('');
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(function step() {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(step, speed);
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      {!done && <span className="cursor">|</span>}
    </span>
  );
}
