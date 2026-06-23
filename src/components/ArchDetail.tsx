import type { ArchNode } from '../data/archData';
import { archEdges, archNodes } from '../data/archData';
import { projects } from '../data/portfolio';

const TYPE_COLORS: Record<string, string> = {
  client:     '#67e8f9',
  gateway:    '#a5b4fc',
  service:    '#6ee7b7',
  queue:      '#fde68a',
  storage:    '#fca5a5',
  infra:      '#d1d5db',
  ai:         '#f9a8d4',
  leadership: '#ffffff',
};

interface Props {
  node: ArchNode | null;
  onClose: () => void;
}

export function ArchDetail({ node, onClose }: Props) {
  const isOpen = node !== null;

  // Find connected nodes
  const connectedIds = node
    ? archEdges
        .filter(e => e.from === node.id || e.to === node.id)
        .map(e => (e.from === node.id ? e.to : e.from))
    : [];
  const connectedNodes = archNodes.filter(n => connectedIds.includes(n.id));

  // Find matching projects
  const matchedProjects = node
    ? projects.filter(p =>
        p.tags.some(tag =>
          node.techs.some(
            tech =>
              tech.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(tech.toLowerCase())
          )
        )
      )
    : [];

  const color = node ? (TYPE_COLORS[node.type] ?? '#fff') : '#fff';

  return (
    <div className={`detail-panel${isOpen ? ' open' : ''}`}>
      {node && (
        <div style={{ padding: '24px' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,255,200,0.4)' }}>
              {node.label}
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4, lineHeight: 1.2 }}>
            {node.title}
          </h2>
          {node.sub && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
              {node.sub}
            </p>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,255,200,0.3)', marginBottom: 10 }}>
              Technologies
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {node.techs.map(t => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,255,200,0.3)', marginBottom: 10 }}>
              Used in
            </div>
            {matchedProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {matchedProjects.map(p => (
                  <div key={p.name}>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.scope}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                Used across multiple production systems.
              </p>
            )}
          </div>

          {connectedNodes.length > 0 && (
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,255,200,0.3)', marginBottom: 10 }}>
                Connected to
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {connectedNodes.map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLORS[n.type] ?? '#fff', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{n.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
