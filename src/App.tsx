import { useState, useCallback } from 'react';
import { PlanetScene } from './components/PlanetScene';
import { PlanetHero } from './components/PlanetHero';
import { InfoPanel } from './components/InfoPanel';
import { IntroOverlay } from './components/IntroOverlay';
import { SoundToggle } from './components/SoundToggle';
import { audio } from './audio';
import type { Selection } from './data/planetData';

export function App() {
  const [selected, setSelected] = useState<Selection | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = useCallback((s: Selection | null) => {
    if (s) audio.sparkle();
    setSelected(s);
  }, []);

  return (
    <div className="planet-stage">
      <PlanetScene selected={selected} onSelect={handleSelect} started={revealed} />
      <div className={`hud${revealed ? ' hud-show' : ''}`}>
        <PlanetHero />
        <SoundToggle />
      </div>
      <InfoPanel selection={selected} onClose={() => setSelected(null)} />
      {!revealed && <IntroOverlay onDone={() => setRevealed(true)} />}
    </div>
  );
}
