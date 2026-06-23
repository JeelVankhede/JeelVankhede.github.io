import { useState } from 'react';
import { StackGraph } from './components/StackGraph';
import { NodeDetail } from './components/NodeDetail';
import { GraphLegend } from './components/GraphLegend';
import { HeroOverlay } from './components/HeroOverlay';
import { MetricsBar } from './components/MetricsBar';
import { BelowFold } from './components/BelowFold';
import type { StackNode } from './data/graphData';

export function App() {
  const [selectedNode, setSelectedNode] = useState<StackNode | null>(null);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <MetricsBar />

      {/* Hero: full-viewport graph section */}
      <section
        id="top"
        style={{ position: 'relative', width: '100%', height: '100vh' }}
      >
        <StackGraph
          onNodeSelect={setSelectedNode}
          selectedNodeId={selectedNode?.id ?? null}
        />
        <HeroOverlay />
        <GraphLegend />
        <NodeDetail
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </section>

      {/* Below-fold: intentionally minimal */}
      <BelowFold />
    </div>
  );
}
