export function HeroOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'max(80px, 5vh)',
        left: 'max(40px, 4vw)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: 'clamp(48px, 6vw, 80px)',
          fontWeight: 700,
          letterSpacing: '-0.06em',
          color: '#ffffff',
          opacity: 0.9,
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        JV
      </div>
      <div
        style={{
          fontSize: '18px',
          fontWeight: 400,
          color: '#ffffff',
          marginBottom: '4px',
        }}
      >
        Jeel Vankhede
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '24px',
        }}
      >
        Lead Full Stack Engineer
      </div>
      <div
        className="hint-text"
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '12px',
        }}
      >
        ↓ Click any node to explore
      </div>
      <div style={{ display: 'flex', gap: '24px', pointerEvents: 'auto' }}>
        <a
          href="#contact"
          style={{
            display: 'inline-flex',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: '#ffffff',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            paddingBottom: '2px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
        >
          View résumé →
        </a>
        <a
          href="#contact"
          style={{
            display: 'inline-flex',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: '#ffffff',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            paddingBottom: '2px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
        >
          Contact →
        </a>
      </div>
    </div>
  );
}
