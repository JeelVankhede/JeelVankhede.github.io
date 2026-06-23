import { metrics, profile } from '../data/portfolio';

export function MetricsBar() {
  return (
    <div className="metrics-bar">
      <a href="#top" style={{ fontSize: 13, fontWeight: 700, color: '#00ffc8', letterSpacing: '-0.02em' }}>
        JV
      </a>
      <div className="metrics-bar-center" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {metrics.map((m, i) => (
          <span key={m.label} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {i > 0 && <span style={{ color: 'rgba(0,255,200,0.15)', padding: '0 10px' }}>|</span>}
            <span style={{ fontSize: 13, color: '#ffffff' }}>{m.value}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}> {m.label}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'GH', href: profile.links.github },
          { label: 'LI', href: profile.links.linkedin },
          { label: 'SO', href: profile.links.stackOverflow },
          { label: 'CV', href: profile.resumeUrl },
        ].map(l => (
          <a
            key={l.label}
            href={l.href}
            target={l.label !== 'CV' ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: 'rgba(0,255,200,0.4)', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00ffc8')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,255,200,0.4)')}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
