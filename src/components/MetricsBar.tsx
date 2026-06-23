import { metrics, profile } from '../data/portfolio';

export function MetricsBar() {
  return (
    <div className="metrics-bar">
      <a
        href="#top"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '14px',
          fontWeight: 700,
          color: '#ffffff',
        }}
      >
        JV
      </a>

      <div className="metrics-bar-center" style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {metrics.map((m, i) => (
          <span key={m.label} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            {i > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.15)', padding: '0 12px' }}>|</span>
            )}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', color: '#ffffff' }}>
              {m.value}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              {m.label}
            </span>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {[
          { label: 'GH', href: profile.links.github },
          { label: 'LI', href: profile.links.linkedin },
          { label: 'SO', href: profile.links.stackOverflow },
          { label: 'CV', href: profile.resumeUrl },
        ].map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.label !== 'CV' ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
