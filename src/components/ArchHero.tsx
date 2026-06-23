export function ArchHero() {
  return (
    <div
      className="hero-overlay"
      style={{
        top: 'max(72px, 8vh)',
        left: 'max(32px, 3vw)',
      }}
    >
      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#00ffc8',
          boxShadow: '0 0 6px #00ffc8',
          animation: 'pulse-dot 2s ease infinite',
        }} />
        <span style={{ fontSize: 10, color: 'rgba(0,255,200,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Available for new roles
        </span>
      </div>

      <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1, marginBottom: 6 }}>
        JV
      </div>
      <div style={{ fontSize: 16, color: '#fff', marginBottom: 2 }}>Jeel Vankhede</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
        Lead Full Stack Engineer
      </div>

      <div className="hint-fade" style={{ fontSize: 10, color: 'rgba(0,255,200,0.5)', marginBottom: 12, letterSpacing: '0.05em' }}>
        ↓ Click any component to inspect
      </div>

      <div style={{ display: 'flex', gap: 16, pointerEvents: 'auto' }}>
        <a
          href="#contact"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: 2 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        >
          Contact →
        </a>
        <a
          href="#work"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: 2 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        >
          View work →
        </a>
      </div>
    </div>
  );
}
