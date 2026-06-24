import { useEffect, useState } from 'react';

const LINE1 = 'Hey there, Stranger!';
const LINE2 = 'Welcome to my digital universe . . .';
const TOTAL_CHARS = LINE1.length + LINE2.length;

const START_DELAY = 500; // before the first character
const CHAR_DELAY = 95; // between characters (typewriter)
const TOTAL_VISIBLE = 7_000; // hold the greeting on screen this long, then fade
const TYPING_DURATION = START_DELAY + (TOTAL_CHARS - 1) * CHAR_DELAY;

interface Props {
  onDone: () => void;
}

/** Black screen that types a greeting character-by-character, then fades to reveal the planet. */
export function IntroOverlay({ onDone }: Props) {
  const [n, setN] = useState(0);
  const [fading, setFading] = useState(false);

  // reveal one character at a time
  useEffect(() => {
    if (n >= TOTAL_CHARS) return;
    const id = setTimeout(() => setN((c) => c + 1), n === 0 ? START_DELAY : CHAR_DELAY);
    return () => clearTimeout(id);
  }, [n]);

  // once fully typed, hold until the 10s mark, then fade out
  useEffect(() => {
    if (n < TOTAL_CHARS) return;
    const hold = Math.max(0, TOTAL_VISIBLE - TYPING_DURATION);
    const id = setTimeout(() => setFading(true), hold);
    return () => clearTimeout(id);
  }, [n]);

  // after the fade transition, hand off to the planet reveal
  useEffect(() => {
    if (!fading) return;
    const id = setTimeout(onDone, 900);
    return () => clearTimeout(id);
  }, [fading, onDone]);

  const l1 = LINE1.slice(0, Math.min(n, LINE1.length));
  const l2 = n > LINE1.length ? LINE2.slice(0, n - LINE1.length) : '';
  const typingLine2 = n > LINE1.length;

  return (
    <div className={`intro-overlay${fading ? ' fade' : ''}`}>
      <div className="msg">
        <span>
          {l1}
          {!typingLine2 && <span className="caret">▌</span>}
        </span>
        <span className="l2">
          {l2}
          {/* cursor stays blinking at the end until the overlay fades */}
          {typingLine2 && <span className="caret">▌</span>}
        </span>
      </div>
    </div>
  );
}
