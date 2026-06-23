import { useState, useRef, useEffect } from 'react';
import { archNodes, archEdges } from '../data/archData';
import type { ArchNode } from '../data/archData';

const TYPE_COLORS: Record<string, string> = {
  client:     '#67e8f9', // cyan-300
  gateway:    '#a5b4fc', // indigo-300
  service:    '#6ee7b7', // green-300
  queue:      '#fde68a', // amber-200
  storage:    '#fca5a5', // red-300
  infra:      '#d1d5db', // gray-300
  ai:         '#f9a8d4', // pink-300
  leadership: '#ffffff',
};

const TYPE_ICONS: Record<string, string> = {
  client:     '◈',
  gateway:    '⬡',
  service:    '▣',
  queue:      '⇌',
  storage:    '⬢',
  infra:      '◎',
  ai:         '✦',
  leadership: '★',
};

interface Props {
  onNodeSelect: (node: ArchNode | null) => void;
  selectedId: string | null;
}

export function ArchDiagram({ onNodeSelect, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const isMobile = dims.w < 768;

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Compute pixel position from percentage
  const px = (node: ArchNode) => ({
    left: (node.x / 100) * dims.w,
    top: (node.y / 100) * dims.h,
    width: node.w,
    height: node.h,
  });

  // Center point of a node in pixels
  const center = (node: ArchNode) => {
    const p = px(node);
    return { x: p.left + p.width / 2, y: p.top + p.height / 2 };
  };

  // Build SVG path between two nodes
  const edgePath = (fromNode: ArchNode, toNode: ArchNode) => {
    const a = center(fromNode);
    const b = center(toNode);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const cx1 = a.x + dx * 0.25 + dy * 0.1;
    const cy1 = a.y + dy * 0.25 - dx * 0.1;
    const cx2 = a.x + dx * 0.75 - dy * 0.1;
    const cy2 = a.y + dy * 0.75 + dx * 0.1;
    return `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`;
  };

  const nodeById = new Map(archNodes.map(n => [n.id, n]));

  // Stagger packet delays per edge
  const packetDuration = (i: number) => 2 + (i % 3) * 0.7;
  const packetDelay = (i: number) => (i * 0.8) % 3;

  // Mobile: vertical card list
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="arch-canvas"
        style={{ paddingTop: '48px', height: 'auto', minHeight: '100vh', overflowY: 'auto' }}
      >
        <div className="scanlines" />
        <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {archNodes.map(node => {
            const color = TYPE_COLORS[node.type] ?? '#fff';
            const icon = TYPE_ICONS[node.type] ?? '◆';
            const isSelected = selectedId === node.id;
            return (
              <div
                key={node.id}
                className={`arch-node${isSelected ? ' selected' : ''}`}
                style={{ position: 'relative', padding: '12px 14px' }}
                onClick={() => onNodeSelect(isSelected ? null : node)}
              >
                <div
                  className="arch-node-icon"
                  style={{ color, background: `${color}18` }}
                >
                  {icon}
                </div>
                <div className="arch-node-label" style={{ color: `${color}99` }}>
                  {node.label}
                </div>
                <div className="arch-node-title">{node.title}</div>
                {node.sub && <div className="arch-node-sub">{node.sub}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="arch-canvas"
      style={{ paddingTop: '48px' }}
    >
      {/* Scanline atmosphere overlay */}
      <div className="scanlines" />

      {/* Zone labels */}
      <div className="arch-zone-label" style={{ left: '4%', top: '10%' }}>— Client Layer</div>
      <div className="arch-zone-label" style={{ left: '4%', top: '30%' }}>— Gateway</div>
      <div className="arch-zone-label" style={{ left: '4%', top: '50%' }}>— Services</div>
      <div className="arch-zone-label" style={{ left: '4%', top: '70%' }}>— Data / Infra</div>

      {/* SVG overlay for edges */}
      <svg className="arch-svg">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(0,255,200,0.4)" />
          </marker>
        </defs>
        {archEdges.map((edge, i) => {
          const fromNode = nodeById.get(edge.from);
          const toNode = nodeById.get(edge.to);
          if (!fromNode || !toNode) return null;
          const d = edgePath(fromNode, toNode);
          const dur = `${packetDuration(i)}s`;
          const delay = `${packetDelay(i)}s`;
          const isSelected =
            selectedId === edge.from || selectedId === edge.to;
          const fromCenter = center(fromNode);
          const toCenter = center(toNode);
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={d}
                fill="none"
                stroke={
                  isSelected
                    ? 'rgba(0,255,200,0.7)'
                    : edge.dashed
                    ? 'rgba(0,255,200,0.12)'
                    : 'rgba(0,255,200,0.25)'
                }
                strokeWidth={isSelected ? 1.5 : 1}
                strokeDasharray={edge.dashed ? '4 6' : undefined}
                markerEnd={!edge.dashed ? 'url(#arrow)' : undefined}
              />
              {edge.animated && (
                <circle r="3" fill="#00ffc8" style={{ filter: 'drop-shadow(0 0 4px #00ffc8)' }}>
                  <animateMotion
                    dur={dur}
                    begin={delay}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              )}
              {edge.label && (
                <text
                  x={(fromCenter.x + toCenter.x) / 2}
                  y={(fromCenter.y + toCenter.y) / 2 - 6}
                  fill="rgba(0,255,200,0.4)"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Arch nodes */}
      {archNodes.map(node => {
        const pos = px(node);
        const color = TYPE_COLORS[node.type] ?? '#fff';
        const icon = TYPE_ICONS[node.type] ?? '◆';
        const isSelected = selectedId === node.id;
        return (
          <div
            key={node.id}
            className={`arch-node${isSelected ? ' selected' : ''}`}
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
              padding: '10px 12px',
              zIndex: isSelected ? 20 : 10,
            }}
            onClick={() => onNodeSelect(isSelected ? null : node)}
          >
            <div
              className="arch-node-icon"
              style={{ color, background: `${color}18` }}
            >
              {icon}
            </div>
            <div className="arch-node-label" style={{ color: `${color}99` }}>
              {node.label}
            </div>
            <div className="arch-node-title">{node.title}</div>
            {node.sub && <div className="arch-node-sub">{node.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}
