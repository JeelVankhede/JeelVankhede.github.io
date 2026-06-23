import { nodes, edges } from '../data/graphData';
import type { StackNode } from '../data/graphData';
import { projects } from '../data/portfolio';

interface NodeDetailProps {
  selectedNode: StackNode | null;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#6ee7b7',
  backend: '#93c5fd',
  mobile: '#c4b5fd',
  cloud: '#fde68a',
  data: '#fca5a5',
  ai: '#f9a8d4',
  leadership: '#ffffff',
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  cloud: 'Cloud & DevOps',
  data: 'Data & Storage',
  ai: 'AI / Dev Tools',
  leadership: 'Leadership',
};

export function NodeDetail({ selectedNode, onClose }: NodeDetailProps) {
  const isOpen = selectedNode !== null;

  const matchedProjects = selectedNode
    ? projects.filter(p =>
        p.tags.some(
          tag =>
            tag.toLowerCase().includes(selectedNode.id.toLowerCase()) ||
            tag.toLowerCase().includes(selectedNode.label.toLowerCase()) ||
            selectedNode.label.toLowerCase().includes(tag.toLowerCase())
        )
      )
    : [];

  const adjacentNodeIds = selectedNode
    ? edges
        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
        .map(e => (e.source === selectedNode.id ? e.target : e.source))
    : [];

  const adjacentNodes = nodes.filter(n => adjacentNodeIds.includes(n.id));

  return (
    <div className={`node-detail-panel${isOpen ? ' open' : ''}`}>
      {selectedNode && (
        <div style={{ padding: '24px' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '20px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px 8px',
            }}
            aria-label="Close"
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: CATEGORY_COLORS[selectedNode.category] ?? '#fff',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {CATEGORY_LABELS[selectedNode.category]}
            </span>
          </div>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '28px',
              lineHeight: 1.2,
            }}
          >
            {selectedNode.label}
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '12px',
              }}
            >
              Used in
            </div>
            {matchedProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {matchedProjects.map(p => (
                  <div key={p.name}>
                    <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                      {p.scope}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                Used across multiple production systems.
              </p>
            )}
          </div>

          {adjacentNodes.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '12px',
                }}
              >
                Co-used with
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {adjacentNodes.map(n => (
                  <span
                    key={n.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: `1px solid ${CATEGORY_COLORS[n.category] ?? '#fff'}40`,
                      background: `${CATEGORY_COLORS[n.category] ?? '#fff'}10`,
                      fontSize: '11px',
                      color: CATEGORY_COLORS[n.category] ?? '#fff',
                    }}
                  >
                    {n.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
