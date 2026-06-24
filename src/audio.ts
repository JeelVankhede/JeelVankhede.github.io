// Tiny Web Audio manager — synthesized ambient space pad + sparkle on click.
// No audio assets; everything is generated. Must be enabled from a user gesture.

type Ambient = { nodes: OscillatorNode[]; gain: GainNode } | null;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: Ambient = null;
let enabled = false;

function ensure(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function startAmbient() {
  if (!ctx || !master || ambient) return;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 650;
  // a few detuned low oscillators → soft drifting pad
  const freqs = [55, 82.5, 110, 164.8];
  const types: OscillatorType[] = ['sine', 'sine', 'triangle', 'sine'];
  const nodes = freqs.map((f, i) => {
    const o = ctx!.createOscillator();
    o.type = types[i];
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 6;
    o.connect(filter);
    o.start();
    return o;
  });
  // slow breathing LFO on the pad gain
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.18;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();
  filter.connect(gain);
  gain.connect(master);
  ambient = { nodes: [...nodes, lfo], gain };
}

export const audio = {
  isEnabled() {
    return enabled;
  },
  setEnabled(on: boolean) {
    enabled = on;
    if (on) {
      const c = ensure();
      startAmbient();
      master!.gain.cancelScheduledValues(c.currentTime);
      master!.gain.linearRampToValueAtTime(0.35, c.currentTime + 1.2);
    } else if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    }
  },
  // bright little arpeggiated sparkle
  sparkle() {
    if (!enabled || !ctx || !master) return;
    const now = ctx.currentTime;
    [1318, 1760, 2349].forEach((f, i) => {
      const t = now + i * 0.045;
      const o = ctx!.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.connect(g);
      g.connect(master!);
      o.start(t);
      o.stop(t + 0.3);
    });
  },
};
