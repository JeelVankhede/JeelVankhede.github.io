import { useState } from 'react';
import { ArchDiagram } from './components/ArchDiagram';
import { ArchDetail } from './components/ArchDetail';
import { ArchHero } from './components/ArchHero';
import { MetricsBar } from './components/MetricsBar';
import { BelowFold } from './components/BelowFold';
import type { ArchNode } from './data/archData';

export function App() {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);

  return (
    <div style={{ background: '#050a0e', minHeight: '100vh', color: '#fff' }}>
      <MetricsBar />
      <section id="top" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <ArchDiagram
          onNodeSelect={setSelectedNode}
          selectedId={selectedNode?.id ?? null}
        />
        <ArchHero />
        <ArchDetail
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </section>
      <BelowFold />
    </div>
  );
}
