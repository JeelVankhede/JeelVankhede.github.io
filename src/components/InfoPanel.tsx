import type { Selection } from '../data/planetData';

interface Props {
  selection: Selection | null;
  onClose: () => void;
}

function Eyebrow({ accent, text }: { accent: string; text: string }) {
  return (
    <div className="eyebrow" style={{ color: accent }}>
      <b style={{ background: accent }} />
      {text}
    </div>
  );
}

function Pills({ tags }: { tags: string[] }) {
  return (
    <div className="pills">
      {tags.map((t) => (
        <span key={t} className="pill">{t}</span>
      ))}
    </div>
  );
}

export function InfoPanel({ selection, onClose }: Props) {
  return (
    <div className={`info-panel${selection ? ' open' : ''}`}>
      {selection && (
        <>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
          {renderBody(selection)}
        </>
      )}
    </div>
  );
}

function renderBody(sel: Selection) {
  switch (sel.kind) {
    case 'skill':
      return (
        <>
          <Eyebrow accent={sel.accent} text={sel.subtitle} />
          <h2>{sel.title}</h2>
          <p className="body">{sel.body}</p>
          <Pills tags={sel.tags} />
        </>
      );
    case 'experience':
      return (
        <>
          <Eyebrow accent={sel.accent} text={`${sel.period} · ${sel.location}`} />
          <h2>{sel.company}</h2>
          <p className="sub">{sel.role}</p>
          <ul className="bullets">
            {sel.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      );
    case 'project':
      return (
        <>
          <Eyebrow accent={sel.accent} text={sel.type} />
          <h2>{sel.name}</h2>
          <p className="body">{sel.scope}</p>
          <p className="impact" style={{ borderColor: `${sel.accent}55` }}>{sel.impact}</p>
          <Pills tags={sel.tags} />
        </>
      );
    case 'identity':
      return (
        <>
          <Eyebrow accent={sel.accent} text={sel.role} />
          <h2>{sel.name}</h2>
          <p className="body">{sel.body}</p>
          <Pills tags={sel.tags} />
        </>
      );
    case 'stat':
      return (
        <>
          <Eyebrow accent={sel.accent} text="By the numbers" />
          <div className="stat-figure" style={{ color: sel.accent }}>{sel.value}</div>
          <h2 style={{ fontSize: 18 }}>{sel.label}</h2>
          <p className="body" style={{ marginTop: 10 }}>{sel.body}</p>
        </>
      );
    case 'contact':
      return (
        <>
          <Eyebrow accent={sel.accent} text="Get in touch" />
          <h2>Let’s talk.</h2>
          <p className="body">Open to Lead / Senior Full Stack and hands-on Technical Lead roles.</p>
          <a className="contact-cta" href={`mailto:${sel.email}`}>Email me →</a>
          <div className="contact-links">
            {sel.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ))}
          </div>
        </>
      );
  }
}
