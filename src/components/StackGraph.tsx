import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { nodes, edges } from '../data/graphData';
import type { StackNode, StackEdge } from '../data/graphData';

type SimNode = StackNode & d3.SimulationNodeDatum;
type SimEdge = { source: SimNode; target: SimNode; strength: number };

interface StackGraphProps {
  onNodeSelect: (node: StackNode | null) => void;
  selectedNodeId: string | null;
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

const PULSE_NODES = new Set(['techleadership', 'architecture', 'react', 'nodejs', 'kotlin', 'reactnative']);

function nodeRadius(weight: number): number {
  if (weight === 1) return 18;
  if (weight === 3) return 36;
  return 26;
}

function nodeFontSize(weight: number): string {
  if (weight === 1) return '11px';
  if (weight === 3) return '13px';
  return '12px';
}

function edgeWidth(strength: number): number {
  if (strength === 1) return 1;
  if (strength === 3) return 2;
  return 1.5;
}

export function StackGraph({ onNodeSelect, selectedNodeId }: StackGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();

    const width = window.innerWidth;
    const height = window.innerHeight;

    svg
      .attr('width', width)
      .attr('height', height)
      .style('background', '#0a0a0a');

    const simNodes: SimNode[] = nodes.map(n => ({ ...n }));
    const nodeById = new Map(simNodes.map(n => [n.id, n]));

    const simEdges = edges
      .map(e => ({
        source: nodeById.get(e.source)!,
        target: nodeById.get(e.target)!,
        strength: e.strength,
      }))
      .filter(e => e.source && e.target);

    const adjacency = new Map<string, Set<string>>();
    simNodes.forEach(n => adjacency.set(n.id, new Set()));
    simEdges.forEach(e => {
      adjacency.get(e.source.id)?.add(e.target.id);
      adjacency.get(e.target.id)?.add(e.source.id);
    });

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .alpha(1)
      .alphaDecay(0.02)
      .velocityDecay(0.4)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimEdge>(simEdges as unknown as SimEdge[])
          .id(d => d.id)
          .distance(120)
          .strength(0.4)
      )
      .force('charge', d3.forceManyBody<SimNode>().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimNode>().radius(d => nodeRadius(d.weight) + 20));

    const linkGroup = svg.append('g').attr('class', 'links');
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const linkEls = linkGroup
      .selectAll<SVGLineElement, SimEdge>('line')
      .data(simEdges as unknown as SimEdge[])
      .enter()
      .append('line')
      .attr('stroke', '#ffffff')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', d => edgeWidth(d.strength));

    const nodeEls = nodeGroup
      .selectAll<SVGGElement, SimNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'graph-node')
      .on('click', (_, d) => onNodeSelect(d))
      .on('mouseenter', (_, hovered) => {
        const adj = adjacency.get(hovered.id) ?? new Set();
        nodeEls.each(function (d) {
          const el = d3.select(this);
          const isAdj = d.id === hovered.id || adj.has(d.id);
          el.select('.node-circle').attr('opacity', isAdj ? 1 : 0.15);
          el.select('.node-label').attr('opacity', isAdj ? 1 : 0.15);
          if (d.id === hovered.id) {
            el.select('.node-label').attr('font-weight', '700');
          }
        });
        linkEls.attr('stroke-opacity', (d) => {
          const src = (d.source as SimNode).id;
          const tgt = (d.target as SimNode).id;
          return src === hovered.id || tgt === hovered.id ? 0.8 : 0.05;
        });
      })
      .on('mouseleave', () => {
        nodeEls.each(function (d) {
          const el = d3.select(this);
          el.select('.node-circle').attr('opacity', 1);
          el.select('.node-label').attr('opacity', d.weight === 1 ? 0 : 1).attr('font-weight', '400');
        });
        linkEls.attr('stroke-opacity', 0.35);
      });

    nodeEls.each(function (d) {
      const g = d3.select(this);
      const r = nodeRadius(d.weight);
      const color = CATEGORY_COLORS[d.category] ?? '#ffffff';

      if (PULSE_NODES.has(d.id)) {
        g.append('circle')
          .attr('class', 'pulse-ring')
          .attr('r', r)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('opacity', 0.4);
      }

      g.append('circle')
        .attr('class', 'node-circle')
        .attr('r', r)
        .attr('fill', color)
        .attr('opacity', 1);

      g.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('dy', r + 12)
        .attr('fill', '#ffffff')
        .attr('font-size', nodeFontSize(d.weight))
        .attr('font-family', "'IBM Plex Mono', monospace")
        .attr('font-weight', '400')
        .attr('opacity', d.weight === 1 ? 0 : 1)
        .text(d.label);
    });

    const dragBehavior = d3
      .drag<SVGGElement, SimNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeEls.call(dragBehavior);

    simulation.on('tick', () => {
      linkEls
        .attr('x1', d => (d.source as SimNode).x ?? 0)
        .attr('y1', d => (d.source as SimNode).y ?? 0)
        .attr('x2', d => (d.target as SimNode).x ?? 0)
        .attr('y2', d => (d.target as SimNode).y ?? 0);

      nodeEls.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        svg.attr('width', w).attr('height', h);
        simulation
          .force('center', d3.forceCenter(w / 2, h / 2))
          .alpha(0.3)
          .restart();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update selection ring when selectedNodeId changes
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll('.selection-ring').remove();

    if (selectedNodeId) {
      svg
        .selectAll<SVGGElement, SimNode>('.graph-node')
        .filter(d => d.id === selectedNodeId)
        .append('circle')
        .attr('class', 'selection-ring')
        .attr('r', d => nodeRadius(d.weight) + 6)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.8);
    }
  }, [selectedNodeId]);

  return (
    <svg
      ref={svgRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
