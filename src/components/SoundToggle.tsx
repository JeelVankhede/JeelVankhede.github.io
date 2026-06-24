import { useState } from 'react';
import { audio } from '../audio';

/** Small speaker toggle (top-right). Sound is OFF until the user enables it. */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  return (
    <button
      className="sound-toggle"
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      onClick={() => {
        const next = !on;
        setOn(next);
        audio.setEnabled(next);
      }}
    >
      {on ? '🔊' : '🔈'}
    </button>
  );
}
