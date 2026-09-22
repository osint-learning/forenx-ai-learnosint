import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import {
  Share2,
  Plus,
  Pin,
  FolderSearch,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Radar,
  CheckCircle2,
  Layers,
  Database,
  RefreshCw,
} from 'lucide-react';
import { OsintService } from '../services/api';
import type { EvidenceNode, EvidenceConnection, InvestigationRecord } from '../types';

const buildEvidenceFromRecon = (target: string, reconData: any): { nodes: EvidenceNode[]; connections: EvidenceConnection[] } => {
  const nodes: EvidenceNode[] = [];
  const connections: EvidenceConnection[] = [];

  const rootId = 'node-target';
  nodes.push({
    id: rootId,
    label: target,
    type: 'Domain',
    status: 'Confirmed',
    notes: reconData?.metadata?.metadata?.title || `Target investigation: ${target}`,
    x: 80,
    y: 130
  });

  if (!reconData) {
    return { nodes, connections };
  }

  // IP / DNS Node
  const ip = reconData.domain?.a?.[0] || reconData.domain?.ip || reconData.website?.ip;
  if (ip) {
    const ipId = 'node-ip';
    nodes.push({
      id: ipId,
      label: String(ip),
      type: 'IP',
      status: 'Confirmed',
      notes: `A Record resolution for ${target}`,
      x: 340,
      y: 70
    });
    connections.push({
      fromId: rootId,
      toId: ipId,
      label: 'DNS Resolution',
      confidence: 100
    });
  }

  // SSL Certificate Node
  if (reconData.ssl?.subject || reconData.ssl?.issuer) {
    const sslId = 'node-ssl';
    const issuer = typeof reconData.ssl.issuer === 'object'
      ? (reconData.ssl.issuer.O || reconData.ssl.issuer.CN || 'Verified SSL')
      : String(reconData.ssl.issuer || 'Verified SSL');

    nodes.push({
      id: sslId,
      label: String(issuer),
      type: 'Document',
      status: reconData.ssl.valid ? 'Confirmed' : 'Unverified',
      notes: `SSL Issuer (${reconData.ssl.protocol || 'TLS'}) - Valid until ${reconData.ssl.validTo || 'N/A'}`,
      x: 340,
      y: 250
    });
    connections.push({
      fromId: rootId,
      toId: sslId,
      label: 'SSL Certificate',
      confidence: 95
    });
  }

  // Technology Stack Node
  if (reconData.technology && Array.isArray(reconData.technology.categories) && reconData.technology.categories.length > 0) {
    const techCategory = reconData.technology.categories[0];
    const techName = techCategory.technologies?.[0]?.name || techCategory.name;
    if (techName) {
      const techId = 'node-tech';
      nodes.push({
        id: techId,
        label: String(techName),
        type: 'Domain',
        status: 'Confirmed',
        notes: `Identified stack: ${techCategory.name}`,
        x: 580,
        y: 80
      });
      connections.push({
        fromId: rootId,
        toId: techId,
        label: 'Runs Technology',
        confidence: 90
      });
    }
  }

  // Server / Security Headers
  if (reconData.headers?.server) {
    const serverId = 'node-server';
    nodes.push({
      id: serverId,
      label: String(reconData.headers.server),
      type: 'Hash',
      status: 'Confirmed',
      notes: `Server HTTP Banner (${reconData.headers.grade || 'Grade ' + (reconData.headers.score || 'N/A')})`,
      x: 580,
      y: 260
    });
    connections.push({
      fromId: rootId,
      toId: serverId,
      label: 'HTTP Server Header',
      confidence: 95
    });
  }

  // Robots Node
  if (reconData.robots?.disallow && Array.isArray(reconData.robots.disallow) && reconData.robots.disallow.length > 0) {
    const robotsId = 'node-robots';
    nodes.push({
      id: robotsId,
      label: `Robots (${reconData.robots.disallow.length} rules)`,
      type: 'Document',
      status: 'Unverified',
      notes: `Robots hidden paths: ${reconData.robots.disallow.slice(0, 3).join(', ')}`,
      x: 200,
      y: 360
    });
    connections.push({
      fromId: rootId,
      toId: robotsId,
      label: 'Hidden Endpoints',
      confidence: 85
    });
  }

  return { nodes, connections };
};

export const InvestigationWorkspace: React.FC = () => {
  const navigate = useNavigate();

  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState<InvestigationRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [nodes, setNodes] = useState<EvidenceNode[]>([]);
  const [connections, setConnections] = useState<EvidenceConnection[]>([]);

  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<EvidenceNode['type']>('Domain');

  const fetchInvestigations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getInvestigations();
      setInvestigations(data || []);

      if (data && data.length > 0) {
        // Automatically select the newest investigation (first in sorted list)
        const initial = data[0];
        setSelectedInvestigation(initial);
        const { nodes: builtNodes, connections: builtConnections } = buildEvidenceFromRecon(
          initial.target || initial.domain || 'Target',
          initial.reconData
        );
        setNodes(builtNodes);
        setConnections(builtConnections);
      } else {
        setSelectedInvestigation(null);
        setNodes([]);
        setConnections([]);
      }
    } catch (err: any) {
      console.error('Error fetching investigations:', err);
      setError(err.message || 'Failed to load investigations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleSelectInvestigation = (item: InvestigationRecord) => {
    setSelectedInvestigation(item);
    const { nodes: builtNodes, connections: builtConnections } = buildEvidenceFromRecon(
      item.target || item.domain || 'Target',
      item.reconData
    );
    setNodes(builtNodes);
    setConnections(builtConnections);
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newNode: EvidenceNode = {
      id: `n-${Date.now()}`,
      label: newLabel.trim(),
      type: newType,
      status: 'Unverified',
      notes: `Manually pinned evidence entity on ${selectedInvestigation?.target || 'target'}`,
      x: 300 + Math.random() * 120,
      y: 180 + Math.random() * 100
    };

    setNodes(prev => [...prev, newNode]);

    if (nodes.length > 0) {
      setConnections(prev => [
        ...prev,
        {
          fromId: nodes[0].id,
          toId: newNode.id,
          label: 'User Correlation',
          confidence: 75
        }
      ]);
    }

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
            Visual entity link graph and evidence mapping populated from real Recon Engine investigations.
          </p>
        </div>

        {selectedInvestigation && (
          <form onSubmit={handleAddNode} className="flex flex-wrap gap-2 items-center">
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as EvidenceNode['type'])}
              className="bg-black/80 border border-[#00ff99]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#00ff99] font-mono focus:outline-none focus:border-[#00ff99]"
            >
              <option value="Domain">Domain</option>
              <option value="IP">IP</option>
              <option value="Email">Email</option>
              <option value="Document">Document</option>
              <option value="Hash">Hash</option>
              <option value="Person">Person</option>
              <option value="Location">Location</option>
            </select>
            <input
              type="text"
              placeholder="Evidence label..."
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className="bg-black/80 border border-[#00ff99]/30 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#00ff99]"
            />
            <GlowButton type="submit" variant="primary" icon={<Plus size={14} />} className="!py-1.5 text-xs">
              Pin Node
            </GlowButton>
          </form>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <GlassCard glow="cyan" className="p-12 text-center space-y-4">
          <Loader2 size={36} className="animate-spin text-[#00ff99] mx-auto" />
          <p className="text-[#00ff99] font-mono text-sm">Loading real investigation cases from database...</p>
        </GlassCard>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <GlassCard glow="none" className="p-8 border-rose-500/40 bg-rose-950/20 text-center space-y-4">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <p className="text-rose-300 font-mono text-sm">{error}</p>
          <GlowButton variant="secondary" onClick={fetchInvestigations} icon={<RefreshCw size={14} />}>
            Retry
          </GlowButton>
        </GlassCard>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && investigations.length === 0 && (
        <GlassCard glow="emerald" className="p-12 text-center space-y-6">
          <FolderSearch size={48} className="text-slate-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white font-mono">No Saved Investigations Found</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              You haven't sent any Recon Engine results to Investigation yet. Run a Recon scan and click <span className="text-[#00ff99]">"SEND TO INVESTIGATE"</span> to create your first case.
            </p>
          </div>
          <GlowButton
            variant="primary"
            icon={<Radar size={16} />}
            onClick={() => navigate('/recon')}
          >
            Launch Recon Engine
          </GlowButton>
        </GlassCard>
      )}

      {/* INVESTIGATION HISTORY LIST & DETECTIVE WALL */}
      {!loading && !error && investigations.length > 0 && (
        <div className="space-y-6">
          {/* Active Cases Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-[#00ff99]" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Saved Investigation Cases ({investigations.length})
              </h2>
            </div>
            <button
              onClick={fetchInvestigations}
              className="text-xs font-mono text-[#00ff99] hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {/* Investigations Horizontal Scroll/Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {investigations.map(item => {
              const isSelected = selectedInvestigation?._id === item._id;
              const dateObj = new Date(item.createdAt);
              const dateStr = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectInvestigation(item)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <GlassCard
                    glow={isSelected ? 'emerald' : 'none'}
                    className={`p-4 border transition-all ${
                      isSelected
                        ? 'border-[#00ff99] bg-[#00ff99]/10 shadow-[0_0_15px_rgba(0,255,153,0.15)]'
                        : 'border-white/10 hover:border-[#00ff99]/40 bg-black/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-mono font-bold text-white text-sm truncate flex items-center gap-1.5">
                        <Radar size={14} className={isSelected ? 'text-[#00ff99]' : 'text-slate-400'} />
                        <span className="truncate">{item.target || item.domain}</span>
                      </div>
                      <Badge variant={isSelected ? 'emerald' : 'purple'} className="text-[10px] uppercase">
                        {item.status || 'Ready for Investigation'}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar size={12} /> Date:
                        </span>
                        <span className="text-slate-300">{dateStr}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={12} /> Time:
                        </span>
                        <span className="text-slate-300">{timeStr}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Layers size={12} /> Progress:
                        </span>
                        <span className="text-[#00ff99] font-semibold">100% Recon Ingested</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-[#00ff99]/30 flex items-center justify-between text-[11px] font-mono text-[#00ff99]">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={12} /> Active Case Opened
                        </span>
                      </div>
                    )}
                  </GlassCard>
                </div>
              );
            })}
          </div>

          {/* Interactive Detective Wall Canvas */}
          {selectedInvestigation && (
            <GlassCard glow="emerald" className="p-6 relative min-h-[500px] overflow-hidden cyber-grid">
              <div className="absolute top-4 left-6 font-mono text-xs text-[#00ff99] flex items-center gap-2">
                <Pin size={14} />
                <span>
                  ACTIVE CASE: <strong className="text-white">{selectedInvestigation.target || selectedInvestigation.domain}</strong> ({nodes.length} EVIDENCE NODES PINNED)
                </span>
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
                        x={(from.x + to.x) / 2 + 30}
                        y={(from.y + to.y) / 2 + 25}
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
                        <Badge variant={node.type === 'IP' ? 'cyan' : node.type === 'Document' ? 'purple' : 'emerald'}>
                          {node.type}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400">{node.status}</span>
                      </div>
                      <div className="font-mono font-bold text-white text-xs truncate">{node.label}</div>
                      <p className="text-[10px] font-mono text-slate-400 line-clamp-2">{node.notes}</p>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
};
