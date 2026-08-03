import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import { Share2, Plus, Pin } from 'lucide-react';
import type { EvidenceNode, EvidenceConnection } from '../types';

export const InvestigationWorkspace: React.FC = () => {
  const [nodes, setNodes] = useState<EvidenceNode[]>([
    { id: 'n1', label: '198.51.100.44', type: 'IP', status: 'Malicious', notes: 'SCADA telemetry exposure', x: 120, y: 140 },
    { id: 'n2', label: 'phantom-corp-sec.org', type: 'Domain', status: 'Confirmed', notes: 'Target parent organization', x: 420, y: 100 },
    { id: 'n3', label: 'admin@phantom-corp.org', type: 'Email', status: 'Unverified', notes: 'Exposed in breach dump', x: 260, y: 320 }
  ]);

  const [connections] = useState<EvidenceConnection[]>([
    { fromId: 'n1', toId: 'n2', label: 'Hosts Subdomain', confidence: 95 },
    { fromId: 'n3', toId: 'n2', label: 'Registrant Contact', confidence: 80 }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newType] = useState<EvidenceNode['type']>('Domain');

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newNode: EvidenceNode = {
      id: `n-${Date.now()}`,
      label: newLabel,
      type: newType,
      status: 'Unverified',
      notes: 'Manually pinned evidence entity',
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100
    };

    setNodes(prev => [...prev, newNode]);
    setNewLabel('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
            <Share2 className="text-[#00ff99]" size={32} />
            INVESTIGATION WORKSPACE <span className="neon-text-emerald">// DETECTIVE WALL</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Visual entity link graph, evidence cards, and relationship mapping.
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddNode} className="flex gap-2">
          <input
            type="text"
            placeholder="Entity label (IP, Domain)..."
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            className="bg-black/80 border border-[#00ff99]/30 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#00ff99]"
          />
          <GlowButton type="submit" variant="primary" icon={<Plus size={14} />} className="!py-1.5">
            Add Node
          </GlowButton>
        </form>
      </div>

      {/* Interactive Detective Wall Canvas */}
      <GlassCard glow="emerald" className="p-6 relative min-h-[500px] overflow-hidden cyber-grid">
        <div className="absolute top-4 left-6 font-mono text-xs text-[#00ff99] flex items-center gap-2">
          <Pin size={14} />
          <span>VISUAL EVIDENCE GRAPH ({nodes.length} ENTITIES PINNED)</span>
        </div>

        {/* Node Link SVG Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((c, i) => {
            const from = nodes.find(n => n.id === c.fromId);
            const to = nodes.find(n => n.id === c.toId);
            if (!from || !to) return null;
            return (
              <g key={i}>
                <line
                  x1={from.x + 80}
                  y1={from.y + 35}
                  x2={to.x + 80}
                  y2={to.y + 35}
                  stroke="#00ff99"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <text
                  x={(from.x + to.x) / 2 + 60}
                  y={(from.y + to.y) / 2 + 30}
                  fill="#7efeff"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {c.label} ({c.confidence}%)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Evidence Cards Nodes */}
        <div className="relative z-10 w-full h-[450px]">
          {nodes.map(node => (
            <div
              key={node.id}
              className="absolute cursor-move transition-transform hover:scale-105"
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
            >
              <GlassCard
                glow={node.status === 'Malicious' ? 'none' : 'emerald'}
                className={`w-52 p-3 space-y-2 border ${
                  node.status === 'Malicious' ? 'border-rose-500/60 bg-rose-950/20' : 'border-[#00ff99]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant={node.type === 'IP' ? 'cyan' : 'emerald'}>{node.type}</Badge>
                  <span className="text-[10px] font-mono text-slate-400">{node.status}</span>
                </div>
                <div className="font-mono font-bold text-white text-xs truncate">{node.label}</div>
                <p className="text-[10px] font-mono text-slate-400 line-clamp-2">{node.notes}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
