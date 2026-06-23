const LEGEND_ITEMS = [
  { category: 'frontend', label: 'Frontend', color: '#6ee7b7' },
  { category: 'backend', label: 'Backend', color: '#93c5fd' },
  { category: 'mobile', label: 'Mobile', color: '#c4b5fd' },
  { category: 'cloud', label: 'Cloud & DevOps', color: '#fde68a' },
  { category: 'data', label: 'Data & Storage', color: '#fca5a5' },
  { category: 'ai', label: 'AI / Dev Tools', color: '#f9a8d4' },
  { category: 'leadership', label: 'Leadership', color: '#ffffff' },
];

export function GraphLegend() {
  return (
    <div
      className="graph-legend"
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.8)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '12px 16px',
      }}
    >
      {LEGEND_ITEMS.map((item, i) => (
        <div
          key={item.category}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: i < LEGEND_ITEMS.length - 1 ? '6px' : 0,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
