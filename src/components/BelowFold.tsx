import { useEffect, useRef } from 'react';
import { projects, metrics, experience, profile } from '../data/portfolio';

function CountUpNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      el.textContent = value;
      return;
    }

    const numericStr = numericMatch[0];
    const target = parseFloat(numericStr);
    const suffix = value.slice(numericStr.length);
    const isFloat = numericStr.includes('.');

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true;
          el.classList.add('count-up-animate');
          const start = performance.now();
          const duration = 1200;

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toString()) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = value;
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      ref={ref}
      style={{
        display: 'block',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 'clamp(32px, 4vw, 52px)',
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.04em',
        marginBottom: '4px',
      }}
    >
      0
    </span>
  );
}

export function BelowFold() {
  return (
    <div style={{ background: '#050a0e' }}>
      {/* Work */}
      <section id="work" style={{ padding: '80px 0', borderTop: '1px solid rgba(0,255,200,0.07)' }}>
        <div className="below-fold-container">
          <p className="section-kicker">— Work</p>
          <h2 className="section-heading">Selected projects.</h2>
          <div>
            {projects.map((p, i) => (
              <div key={p.name} className="project-row">
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'rgba(0,255,200,0.25)', paddingTop: '2px' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                    {p.name}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                    {p.type}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                  {p.tags.map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility / Numbers */}
      <section id="credibility" style={{ padding: '60px 0', borderTop: '1px solid rgba(0,255,200,0.07)' }}>
        <div className="below-fold-container">
          <p className="section-kicker">— Numbers</p>
          <h2 className="section-heading">By the numbers.</h2>
          <div className="metrics-grid">
            {metrics.map(m => (
              <div key={m.label} className="metric-cell">
                <CountUpNumber value={m.value} />
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" style={{ padding: '60px 0 80px', borderTop: '1px solid rgba(0,255,200,0.07)' }}>
        <div className="below-fold-container">
          <p className="section-kicker">— Experience</p>
          <h2 className="section-heading">Engineering progression.</h2>
          {experience.map((e, i) => (
            <div key={e.company} style={{ marginBottom: i < experience.length - 1 ? '40px' : 0 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                {e.company}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: 'rgba(0,255,200,0.4)', marginBottom: '4px' }}>
                {e.role}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                {e.period} · {e.location}
              </div>
              <ul style={{ paddingLeft: '20px' }}>
                {e.bullets.map(b => (
                  <li
                    key={b}
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      marginBottom: '4px',
                    }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '80px 0 120px', borderTop: '1px solid rgba(0,255,200,0.07)' }}>
        <div className="below-fold-container" style={{ maxWidth: '600px' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Need a technical lead who can still ship?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Best suited for Lead Full Stack Engineer, Senior Full Stack Engineer, and hands-on Technical Lead roles.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a
              href={`mailto:${profile.email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                color: '#050a0e',
                background: '#00ffc8',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Email me →
            </a>
            <a
              href={profile.resumeUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                color: '#ffffff',
                background: 'transparent',
                border: '1px solid rgba(0,255,200,0.3)',
                padding: '12px 28px',
                borderRadius: '8px',
              }}
            >
              View résumé →
            </a>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '60px' }}>
            {[
              { label: 'GitHub', href: profile.links.github },
              { label: 'LinkedIn', href: profile.links.linkedin },
              { label: 'Stack Overflow', href: profile.links.stackOverflow },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  color: 'rgba(0,255,200,0.35)',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00ffc8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,255,200,0.35)')}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.2)',
            }}
          >
            © 2025 Jeel Vankhede
          </div>
        </div>
      </section>
    </div>
  );
}
