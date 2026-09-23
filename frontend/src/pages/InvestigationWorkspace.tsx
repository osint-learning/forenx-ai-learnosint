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
  Globe,
  Lock,
  Cpu,
  FileCode,
  FileText,
  ShieldCheck,
  Tag,
  Target,
  Check,
  ListTodo,
} from 'lucide-react';
import { OsintService } from '../services/api';
import type { EvidenceNode, EvidenceConnection, InvestigationRecord, InvestigationObjective } from '../types';

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


const DEFAULT_OBJECTIVES: InvestigationObjective[] = [
  { title: 'Analyze domain information', completed: false },
  { title: 'Examine DNS records', completed: false },
  { title: 'Identify technologies', completed: false },
  { title: 'Examine exposed services', completed: false },
  { title: 'Correlate important findings', completed: false },
];

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
  const [showAllRobotsRules, setShowAllRobotsRules] = useState(false);

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
    setShowAllRobotsRules(false);
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

  
  const [isUpdatingObjectives, setIsUpdatingObjectives] = useState(false);

  const handleToggleObjective = async (index: number) => {
    if (!selectedInvestigation) return;

    const baseObjectives = (selectedInvestigation.objectives && selectedInvestigation.objectives.length > 0)
      ? selectedInvestigation.objectives
      : DEFAULT_OBJECTIVES;

    const updatedObjectives: InvestigationObjective[] = baseObjectives.map((obj, idx) =>
      idx === index ? { ...obj, completed: !obj.completed } : { ...obj }
    );

    const updatedInvestigation: InvestigationRecord = {
      ...selectedInvestigation,
      objectives: updatedObjectives,
    };

    setSelectedInvestigation(updatedInvestigation);
    setInvestigations(prev =>
      prev.map(inv => (inv._id === updatedInvestigation._id ? updatedInvestigation : inv))
    );

    try {
      setIsUpdatingObjectives(true);
      const saved = await OsintService.updateInvestigationObjectives(
        selectedInvestigation._id,
        updatedObjectives
      );
      if (saved) {
        setSelectedInvestigation(prev => (prev?._id === saved._id ? saved : prev));
        setInvestigations(prev =>
          prev.map(inv => (inv._id === saved._id ? saved : inv))
        );
      }
    } catch (err: any) {
      console.error('Failed to update objective on server:', err);
    } finally {
      setIsUpdatingObjectives(false);
    }
  };

  const recon = selectedInvestigation?.reconData || {};

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
            Visual entity link graph, evidence cards, and real Recon Engine intelligence dossier.
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
        <div className="space-y-8">
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
              className="text-xs font-mono text-[#00ff99] hover:underline flex items-center gap-1 cursor-pointer"
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

          
          {/* 1. INVESTIGATION MISSION & OBJECTIVES */}
          {selectedInvestigation && (
            <GlassCard glow="cyan" className="p-6 border border-[#00ff99]/30 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Column: Target & Mission */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={20} className="text-[#00ff99]" />
                      <span className="text-xs font-mono uppercase tracking-widest text-[#00ff99] font-bold">
                        Investigation Mission
                      </span>
                    </div>
                    {isUpdatingObjectives && (
                      <span className="text-[11px] font-mono text-cyan-400 animate-pulse flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                        <Loader2 size={11} className="animate-spin" /> Saving Progress...
                      </span>
                    )}
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Target:</span>
                      <span className="text-sm font-mono font-bold text-white bg-[#00ff99]/10 text-[#00ff99] px-3 py-1 rounded-lg border border-[#00ff99]/30 flex items-center gap-2">
                        <Globe size={14} className="text-[#00ff99]" />
                        {selectedInvestigation.target || selectedInvestigation.domain}
                      </span>
                      <Badge variant="purple" className="text-[10px]">
                        ACTIVE RECON CONTEXT
                      </Badge>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        {selectedInvestigation.mission?.title || 'Reconnaissance Investigation'}
                      </h3>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                        "{selectedInvestigation.mission?.description || 'Analyze the reconnaissance results and identify important security-relevant findings.'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Objectives Checklist */}
                <div className="flex-1 space-y-3">
                  {(() => {
                    const currentObjs = (selectedInvestigation.objectives && selectedInvestigation.objectives.length > 0)
                      ? selectedInvestigation.objectives
                      : DEFAULT_OBJECTIVES;
                    const completedCount = currentObjs.filter(o => o.completed).length;
                    const totalCount = currentObjs.length;
                    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                    const isAllDone = totalCount > 0 && completedCount === totalCount;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-mono text-xs text-white">
                            <ListTodo size={16} className="text-[#00ff99]" />
                            <span className="font-bold uppercase tracking-wider">Investigation Objectives</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-slate-400">
                              {completedCount}/{totalCount} Completed
                            </span>
                            <Badge variant={isAllDone ? 'emerald' : 'cyan'}>
                              {pct}%
                            </Badge>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-black/60 border border-white/10 rounded-full h-2 overflow-hidden p-0.5">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-[#00ff99] h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {/* Objectives List */}
                        <div className="space-y-2 pt-1">
                          {currentObjs.map((obj, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleObjective(idx)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer font-mono text-xs ${
                                obj.completed
                                  ? 'bg-[#00ff99]/10 border-[#00ff99]/60 text-white shadow-[0_0_12px_rgba(0,255,153,0.12)]'
                                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-[#00ff99]/40 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                    obj.completed
                                      ? 'bg-[#00ff99] border-[#00ff99] text-black shadow-[0_0_8px_#00ff99]'
                                      : 'border-slate-500 bg-black/60 text-transparent'
                                  }`}
                                >
                                  <Check size={13} className={obj.completed ? 'stroke-[3]' : 'opacity-0'} />
                                </div>
                                <span className={obj.completed ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}>
                                  {obj.title}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  obj.completed
                                    ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40'
                                    : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {obj.completed ? 'Completed' : 'Pending'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </GlassCard>
          )}


          {/* Detective Wall Canvas */}
          {selectedInvestigation && (
            <div className="space-y-8">
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

              {/* ========================================================================= */}
              {/* RECON INTELLIGENCE DOSSIER (REAL STORED RECON ENGINE OUTPUT) */}
              {/* ========================================================================= */}
              <div className="space-y-6">
                <div className="border-b border-[#00ff99]/20 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radar className="text-[#00ff99]" size={24} />
                    <h2 className="text-xl font-bold font-mono text-white tracking-wide">
                      RECON INTELLIGENCE DOSSIER <span className="neon-text-emerald">// {selectedInvestigation.target || selectedInvestigation.domain}</span>
                    </h2>
                  </div>
                  <Badge variant="emerald" className="font-mono text-xs">
                    REAL RECON DATA
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. DOMAIN & DNS INFORMATION */}
                  {recon.domain && (
                    <GlassCard glow="emerald" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#00ff99] flex items-center gap-2 font-mono">
                          <Globe size={18} /> Domain & DNS Information
                        </h3>
                        <Badge variant="emerald">DNS</Badge>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Target Domain:</span>
                          <span className="text-white font-semibold">{recon.domain.domain || selectedInvestigation.target}</span>
                        </div>

                        {recon.domain.ip && (
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Primary IP:</span>
                            <span className="text-cyan-400 font-semibold">{recon.domain.ip}</span>
                          </div>
                        )}

                        {recon.domain.a && recon.domain.a.length > 0 && (
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1.5">A Records:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {recon.domain.a.map((ipVal: string, idx: number) => (
                                <Badge key={idx} variant="cyan" className="font-mono">{ipVal}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {recon.domain.mx && recon.domain.mx.length > 0 && (
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1.5">MX (Mail Exchange) Records:</span>
                            <div className="space-y-1">
                              {recon.domain.mx.map((mxVal: any, idx: number) => (
                                <div key={idx} className="text-slate-300 truncate">
                                  {typeof mxVal === 'object' ? `${mxVal.exchange || mxVal.host || ''} (${mxVal.priority || 0})` : String(mxVal)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {recon.domain.ns && recon.domain.ns.length > 0 && (
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1.5">Nameservers (NS):</span>
                            <div className="space-y-1">
                              {recon.domain.ns.map((nsVal: string, idx: number) => (
                                <div key={idx} className="text-slate-300 truncate">{nsVal}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {recon.domain.txt && recon.domain.txt.length > 0 && (
                          <div className="pb-1">
                            <span className="text-slate-400 block mb-1.5">TXT Records ({recon.domain.txt.length}):</span>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {recon.domain.txt.map((txtVal: any, idx: number) => (
                                <div key={idx} className="bg-black/30 p-1.5 rounded text-[11px] text-slate-300 break-all border border-white/5">
                                  {Array.isArray(txtVal) ? txtVal.join(' ') : String(txtVal)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  )}

                  {/* 2. WHOIS RECORD */}
                  {recon.whois && (
                    <GlassCard glow="cyan" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#7efeff] flex items-center gap-2 font-mono">
                          <FileText size={18} /> WHOIS Details
                        </h3>
                        <Badge variant="cyan">WHOIS</Badge>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Registrar:</span>
                          <span className="text-white text-right truncate max-w-[200px]">
                            {recon.whois.registrar || recon.whois.registrarName || 'Unknown'}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Created Date:</span>
                          <span className="text-slate-300">{recon.whois.creationDate || recon.whois.created || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Expiry Date:</span>
                          <span className="text-slate-300">{recon.whois.registryExpiryDate || recon.whois.expires || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Updated Date:</span>
                          <span className="text-slate-300">{recon.whois.updatedDate || recon.whois.changed || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Registrant Org:</span>
                          <span className="text-white text-right truncate max-w-[200px]">
                            {recon.whois.registrantOrganization || recon.whois.org || 'Redacted / Private'}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">Registrant Country:</span>
                          <span className="text-slate-300">{recon.whois.registrantCountry || recon.whois.country || 'N/A'}</span>
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {/* 3. SSL/TLS CERTIFICATE */}
                  {recon.ssl && (
                    <GlassCard glow="emerald" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#00ff99] flex items-center gap-2 font-mono">
                          <Lock size={18} /> SSL / TLS Certificate
                        </h3>
                        <Badge variant={recon.ssl.valid ? 'emerald' : 'danger'}>
                          {recon.ssl.valid ? 'VALID CERTIFICATE' : 'INVALID / EXPIRED'}
                        </Badge>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Issuer:</span>
                          <span className="text-white font-semibold text-right truncate max-w-[200px]">
                            {typeof recon.ssl.issuer === 'object'
                              ? (recon.ssl.issuer.O || recon.ssl.issuer.CN || 'Unknown')
                              : String(recon.ssl.issuer || 'Unknown')}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Protocol:</span>
                          <span className="text-cyan-400 font-semibold">{recon.ssl.protocol || 'TLS'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Valid From:</span>
                          <span className="text-slate-300">{recon.ssl.validFrom || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Valid To:</span>
                          <span className="text-slate-300">{recon.ssl.validTo || 'N/A'}</span>
                        </div>

                        {recon.ssl.daysRemaining !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Days Remaining:</span>
                            <span className={recon.ssl.daysRemaining < 30 ? 'text-rose-400 font-bold' : 'text-[#00ff99] font-bold'}>
                              {recon.ssl.daysRemaining} days
                            </span>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  )}

                  {/* 4. SECURITY HEADERS */}
                  {recon.headers && (
                    <GlassCard glow="cyan" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#7efeff] flex items-center gap-2 font-mono">
                          <ShieldCheck size={18} /> Security Headers Analysis
                        </h3>
                        {recon.headers.grade && (
                          <Badge variant="purple" className="font-mono font-bold">
                            GRADE {recon.headers.grade}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        {recon.headers.server && (
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Server Banner:</span>
                            <span className="text-white font-semibold truncate max-w-[200px]">{recon.headers.server}</span>
                          </div>
                        )}

                        {recon.headers.score !== undefined && (
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Security Score:</span>
                            <span className="text-[#00ff99] font-semibold">{recon.headers.score} / 100</span>
                          </div>
                        )}

                        {recon.headers.present && Object.keys(recon.headers.present).length > 0 && (
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1.5">Present Security Headers:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.keys(recon.headers.present).map((hName, idx) => (
                                <Badge key={idx} variant="emerald">{hName}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {recon.headers.missing && Array.isArray(recon.headers.missing) && recon.headers.missing.length > 0 && (
                          <div>
                            <span className="text-slate-400 block mb-1.5">Missing Security Headers:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {recon.headers.missing.map((hName: string, idx: number) => (
                                <Badge key={idx} variant="danger">{hName}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  )}

                  {/* 5. DETECTED TECHNOLOGIES */}
                  {recon.technology && (
                    <GlassCard glow="cyan" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#7efeff] flex items-center gap-2 font-mono">
                          <Cpu size={18} /> Technologies & Stack
                        </h3>
                        <Badge variant="cyan">STACK</Badge>
                      </div>

                      <div className="space-y-4 font-mono text-xs">
                        {Array.isArray(recon.technology.categories) && recon.technology.categories.length > 0 ? (
                          recon.technology.categories.map((cat: any, idx: number) => (
                            <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                              <span className="text-slate-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                                {cat.name || 'Technology'}:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(cat.technologies) ? (
                                  cat.technologies.map((t: any, tIdx: number) => (
                                    <Badge key={tIdx} variant="purple" className="font-mono">
                                      {typeof t === 'object' ? (t.name || t.version ? `${t.name} ${t.version || ''}` : JSON.stringify(t)) : String(t)}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="purple">{cat.name}</Badge>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500">No specific technologies identified.</p>
                        )}
                      </div>
                    </GlassCard>
                  )}

                  {/* 6. ROBOTS.TXT & RULES */}
                  {recon.robots && (
                    <GlassCard glow="emerald" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#00ff99] flex items-center gap-2 font-mono">
                          <FileCode size={18} /> robots.txt Rules
                        </h3>
                        <Badge variant="emerald">CRAWL RULES</Badge>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Robots URL:</span>
                          <span className="text-[#7efeff] truncate max-w-[200px]">{recon.robots.url || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Sitemaps:</span>
                          <span className="text-white truncate max-w-[200px]">{recon.robots.sitemaps || 'None Found'}</span>
                        </div>

                        {Array.isArray(recon.robots.disallow) && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-slate-400">Total Disallow Rules:</span>
                              <Badge variant="purple">{recon.robots.disallow.length}</Badge>
                            </div>

                            {recon.robots.disallow.length > 0 ? (
                              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {recon.robots.disallow
                                  .slice(0, showAllRobotsRules ? recon.robots.disallow.length : 6)
                                  .map((rule: string, rIdx: number) => (
                                    <div key={rIdx} className="bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-300 truncate">
                                      {rule}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-slate-500">No Disallow Rules present.</p>
                            )}

                            {recon.robots.disallow.length > 6 && (
                              <button
                                onClick={() => setShowAllRobotsRules(!showAllRobotsRules)}
                                className="mt-2 text-[#00ff99] hover:underline text-[11px] block cursor-pointer"
                              >
                                {showAllRobotsRules ? 'Show Less' : `+ ${recon.robots.disallow.length - 6} More Rules`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  )}

                  {/* 7. PAGE METADATA */}
                  {recon.metadata && (
                    <GlassCard glow="emerald" className="p-6 md:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#00ff99] flex items-center gap-2 font-mono">
                          <Tag size={18} /> Web Page Metadata Analysis
                        </h3>
                        <Badge variant="emerald">METADATA</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="space-y-3">
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1">Page Title:</span>
                            <span className="text-white font-semibold break-words">
                              {recon.metadata?.metadata?.title || recon.metadata?.title || 'Not Found'}
                            </span>
                          </div>

                          <div className="border-b border-white/10 pb-2">
                            <span className="text-slate-400 block mb-1">Description:</span>
                            <span className="text-slate-300 break-words">
                              {recon.metadata?.metadata?.description || recon.metadata?.description || 'Not Found'}
                            </span>
                          </div>

                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Publisher:</span>
                            <span className="text-white font-semibold">
                              {recon.metadata?.metadata?.publisher || recon.metadata?.publisher || 'Unknown'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-400">Charset / Lang:</span>
                            <span className="text-slate-300">
                              {recon.metadata?.charset || 'N/A'} / {recon.metadata?.metadata?.lang || recon.metadata?.lang || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {recon.metadata?.keywords && (
                            <div className="border-b border-white/10 pb-2">
                              <span className="text-slate-400 block mb-1.5">Keywords:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {recon.metadata.keywords.split(',').map((kw: string, kwIdx: number) => (
                                  <Badge key={kwIdx} variant="purple">{kw.trim()}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {recon.metadata?.metadata?.url && (
                            <div className="border-b border-white/10 pb-2">
                              <span className="text-slate-400 block mb-1">Source URL:</span>
                              <span className="text-cyan-400 break-all">{recon.metadata.metadata.url}</span>
                            </div>
                          )}

                          {recon.metadata?.metadata?.logo && (
                            <div>
                              <span className="text-slate-400 block mb-1.5">Website Logo:</span>
                              <img
                                src={recon.metadata.metadata.logo}
                                alt="Logo"
                                className="w-10 h-10 rounded bg-white p-1 object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};