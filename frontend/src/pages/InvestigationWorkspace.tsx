import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import {
  Share2,
  Plus,
  Pin,
  FolderSearch,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  Globe,
  Lock,
  Cpu,
  FileCode,
  FileText,
  ShieldCheck,
  Target,
  Check,
  ListTodo,
  ArrowLeft,
  Sparkles,
  Award,
} from 'lucide-react';
import { OsintService } from '../services/api';
import type {
  EvidenceNode,
  EvidenceConnection,
  InvestigationRecord,
  InvestigationObjective,
  InvestigationFinding,
  InvestigationConclusion,
  InvestigationReportData
} from '../types';

import { AiInvestigationPanel } from '../components/investigations/AiInvestigationPanel';
import { FindingsCorrelationPanel } from '../components/investigations/FindingsCorrelationPanel';
import { StudentEvaluationPanel } from '../components/investigations/StudentEvaluationPanel';
import { InvestigationReportModal } from '../components/investigations/InvestigationReportModal';

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
  const { id } = useParams<{ id: string }>();

  const [investigation, setInvestigation] = useState<InvestigationRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [nodes, setNodes] = useState<EvidenceNode[]>([]);
  const [connections, setConnections] = useState<EvidenceConnection[]>([]);

  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<EvidenceNode['type']>('Domain');
  const [showAllRobotsRules, setShowAllRobotsRules] = useState(false);
  const [isUpdatingObjectives, setIsUpdatingObjectives] = useState(false);

  // Phase 9 Conclusion and Report State
  const [conclusion, setConclusion] = useState<InvestigationConclusion | null>(null);
  const [isGeneratingConclusion, setIsGeneratingConclusion] = useState(false);
  const [report, setReport] = useState<InvestigationReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchInvestigation = async () => {
    try {
      setLoading(true);
      setError('');

      let record: InvestigationRecord | null = null;
      if (id) {
        record = await OsintService.getInvestigationById(id);
      } else {
        const list = await OsintService.getInvestigations();
        if (list && list.length > 0) {
          record = list[0];
        }
      }

      if (record) {
        setInvestigation(record);
        setConclusion(record.finalConclusion || null);
        setReport(record.report || null);
        const { nodes: builtNodes, connections: builtConnections } = buildEvidenceFromRecon(
          record.target || record.domain || 'Target',
          record.reconData
        );
        setNodes(builtNodes);
        setConnections(builtConnections);
      } else {
        setInvestigation(null);
      }
    } catch (err: any) {
      console.error('Error fetching investigation workspace:', err);
      setError(err.message || 'Failed to load investigation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigation();
  }, [id]);

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !investigation) return;

    const newNode: EvidenceNode = {
      id: `n-${Date.now()}`,
      label: newLabel.trim(),
      type: newType,
      status: 'Unverified',
      notes: `Manually pinned evidence entity on ${investigation.target || 'target'}`,
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
    handleActionLogged('Pin Evidence', `Manually pinned node: ${newLabel.trim()} (${newType})`, newLabel.trim());
  };

  const handleToggleObjective = async (index: number) => {
    if (!investigation) return;

    const baseObjectives = (investigation.objectives && investigation.objectives.length > 0)
      ? investigation.objectives
      : DEFAULT_OBJECTIVES;

    const updatedObjectives: InvestigationObjective[] = baseObjectives.map((obj, idx) =>
      idx === index ? { ...obj, completed: !obj.completed } : { ...obj }
    );

    const updatedInvestigation: InvestigationRecord = {
      ...investigation,
      objectives: updatedObjectives,
    };

    setInvestigation(updatedInvestigation);

    try {
      setIsUpdatingObjectives(true);
      const saved = await OsintService.updateInvestigationObjectives(
        investigation._id,
        updatedObjectives
      );
      if (saved) {
        setInvestigation(saved);
      }
      handleActionLogged(
        'Objective Updated',
        `Marked objective "${baseObjectives[index].title}" as ${!baseObjectives[index].completed ? 'Completed' : 'Pending'}`,
        investigation.target
      );
    } catch (err: any) {
      console.error('Failed to update objective on server:', err);
    } finally {
      setIsUpdatingObjectives(false);
    }
  };

  const handlePinFindingToGraph = (finding: InvestigationFinding) => {
    if (!investigation) return;
    const newNodeId = `finding-${Date.now()}`;
    const newNode: EvidenceNode = {
      id: newNodeId,
      label: finding.title,
      type: 'Document',
      status: 'Confirmed',
      notes: `${finding.category} [${finding.severity}]: ${finding.description}`,
      x: 350 + Math.random() * 150,
      y: 200 + Math.random() * 100,
    };

    setNodes(prev => [...prev, newNode]);
    if (nodes.length > 0) {
      setConnections(prev => [
        ...prev,
        {
          fromId: nodes[0].id,
          toId: newNode.id,
          label: 'Correlated Finding',
          confidence: 95,
        },
      ]);
    }
  };

  const handleActionLogged = async (actionType: string, description: string, targetItem?: string) => {
    if (!investigation) return;
    try {
      const res = await OsintService.logInvestigationAction(
        investigation._id,
        actionType,
        description,
        targetItem
      );
      if (res) {
        setInvestigation(prev => prev ? {
          ...prev,
          studentActions: res.studentActions,
          evaluation: res.evaluation,
        } : null);
      }
    } catch (err) {
      console.error('Failed to log action:', err);
    }
  };

  // Phase 9 Conclusion Generator
  const handleGenerateConclusion = async () => {
    if (!investigation) return;
    try {
      setIsGeneratingConclusion(true);
      const res = await OsintService.generateInvestigationConclusion(investigation._id);
      setConclusion(res);
      setInvestigation(prev => prev ? { ...prev, finalConclusion: res, status: 'Completed', progress: 100 } : null);
      handleActionLogged('Final Conclusion', 'Generated executive investigation conclusion for ' + investigation.target, investigation.target);
    } catch (err: any) {
      console.error('Failed to generate conclusion:', err);
      alert(err.message || 'Failed to generate conclusion.');
    } finally {
      setIsGeneratingConclusion(false);
    }
  };

  // Phase 9 Report Generator & Viewer
  const handleGenerateReport = async () => {
    if (!investigation) return;
    try {
      setIsGeneratingReport(true);
      const res = await OsintService.generateInvestigationReport(investigation._id);
      setReport(res);
      setShowReportModal(true);
      setInvestigation(prev => prev ? { ...prev, report: res, status: 'Completed', progress: 100 } : null);
      handleActionLogged('Report Generation', 'Compiled final OSINT intelligence report for ' + investigation.target, investigation.target);
    } catch (err: any) {
      console.error('Failed to generate report:', err);
      alert(err.message || 'Failed to generate report.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const recon = investigation?.reconData || {};

  return (
    <div className="space-y-8 font-mono">
      {/* Top Navigation & Workspace Header */}
      <div className="border-b border-[#00ff99]/20 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/investigations')}
            className="text-xs text-[#00ff99] hover:underline flex items-center gap-1.5 cursor-pointer bg-black/50 border border-[#00ff99]/30 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,255,153,0.1)] hover:bg-[#00ff99]/10 transition-all"
          >
            <ArrowLeft size={14} /> Back to Investigations
          </button>

          {investigation && (
            <div className="flex items-center gap-2">
              <Badge variant={investigation.status === 'Completed' || investigation.progress === 100 ? 'emerald' : 'cyan'}>
                {investigation.status || 'In Progress'}
              </Badge>
              <Badge variant="purple">
                Progress: {investigation.progress || 20}%
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase flex items-center gap-3">
              <Share2 className="text-[#00ff99]" size={28} />
              INVESTIGATION WORKSPACE <span className="neon-text-emerald">// {investigation?.target || 'ACTIVE CASE'}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Live evidence link graph, reconnaissance dossier, AI intelligence mentor, and report synthesis.
            </p>
          </div>

          {investigation && (
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
                placeholder="Pin evidence label..."
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
      </div>

      {/* LOADING STATE */}
      {loading && (
        <GlassCard glow="cyan" className="p-12 text-center space-y-4">
          <Loader2 size={36} className="animate-spin text-[#00ff99] mx-auto" />
          <p className="text-[#00ff99] text-sm">Loading investigation case from database...</p>
        </GlassCard>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <GlassCard glow="none" className="p-8 border-rose-500/40 bg-rose-950/20 text-center space-y-4">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <p className="text-rose-300 text-sm">{error}</p>
          <GlowButton variant="secondary" onClick={fetchInvestigation} icon={<RefreshCw size={14} />}>
            Retry
          </GlowButton>
        </GlassCard>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && !investigation && (
        <GlassCard glow="emerald" className="p-12 text-center space-y-6">
          <FolderSearch size={48} className="text-slate-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white">Investigation Case Not Found</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              This investigation may have been deleted or moved. Return to history to select an active case.
            </p>
          </div>
          <GlowButton variant="primary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/investigations')}>
            Return to Investigation History
          </GlowButton>
        </GlassCard>
      )}

      {/* ACTIVE WORKSPACE CONTENTS */}
      {!loading && !error && investigation && (
        <div className="space-y-8">
          {/* 1. PHASE 4: INVESTIGATION MISSION & OBJECTIVES CARD */}
          <GlassCard glow="cyan" className="p-6 border border-[#00ff99]/30 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left Column: Target & Mission */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-[#00ff99]" />
                    <span className="text-xs uppercase tracking-widest text-[#00ff99] font-bold">
                      Investigation Mission
                    </span>
                  </div>
                  {isUpdatingObjectives && (
                    <span className="text-[11px] text-cyan-400 animate-pulse flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                      <Loader2 size={11} className="animate-spin" /> Saving Progress...
                    </span>
                  )}
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Target:</span>
                    <span className="text-sm font-bold text-white bg-[#00ff99]/10 text-[#00ff99] px-3 py-1 rounded-lg border border-[#00ff99]/30 flex items-center gap-2">
                      <Globe size={14} className="text-[#00ff99]" />
                      {investigation.target || investigation.domain}
                    </span>
                    <Badge variant="purple" className="text-[10px]">
                      ACTIVE RECON CONTEXT
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {investigation.mission?.title || 'Reconnaissance Investigation'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                      "{investigation.mission?.description || 'Analyze the reconnaissance results and identify important security-relevant findings.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Objectives Checklist */}
              <div className="flex-1 space-y-3">
                {(() => {
                  const currentObjs = (investigation.objectives && investigation.objectives.length > 0)
                    ? investigation.objectives
                    : DEFAULT_OBJECTIVES;
                  const completedCount = currentObjs.filter(o => o.completed).length;
                  const totalCount = currentObjs.length;
                  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                  const isAllDone = totalCount > 0 && completedCount === totalCount;

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white">
                          <ListTodo size={16} className="text-[#00ff99]" />
                          <span className="font-bold uppercase tracking-wider">Investigation Objectives</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">
                            {completedCount}/{totalCount} Completed
                          </span>
                          <Badge variant={isAllDone ? 'emerald' : 'cyan'}>
                            {pct}%
                          </Badge>
                        </div>
                      </div>

                      <div className="w-full bg-black/60 border border-white/10 rounded-full h-2 overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-[#00ff99] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        {currentObjs.map((obj, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleObjective(idx)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer text-xs ${
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

          {/* 2. PHASE 5: AI-ASSISTED INVESTIGATION PANEL */}
          <AiInvestigationPanel
            investigation={investigation}
            onActionLogged={handleActionLogged}
          />

          {/* 3. PHASE 6: FINDINGS & MULTI-SOURCE CORRELATION PANEL */}
          <FindingsCorrelationPanel
            investigation={investigation}
            onPinFindingToGraph={handlePinFindingToGraph}
            onActionLogged={handleActionLogged}
            onFindingsUpdated={newFindings => {
              setInvestigation(prev => prev ? { ...prev, findings: newFindings } : null);
            }}
          />

          {/* 4. PHASE 7: STUDENT EVALUATION & FEEDBACK PANEL */}
          <StudentEvaluationPanel
            investigation={investigation}
            onActionLogged={handleActionLogged}
          />

          {/* 5. PHASE 9: FINAL INVESTIGATION CONCLUSION & REPORT */}
          <GlassCard glow="cyan" className="p-6 border border-[#00ff99]/30 relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 flex items-center justify-center text-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]">
                  <Award size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    FINAL INVESTIGATION OUTPUT
                    <Badge variant="emerald" className="text-[10px]">PHASE 9</Badge>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Synthesize conclusions from real Recon evidence and generate intelligence reports
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <GlowButton
                  variant="secondary"
                  onClick={handleGenerateConclusion}
                  disabled={isGeneratingConclusion}
                  icon={isGeneratingConclusion ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  className="!py-1.5 text-xs"
                >
                  {isGeneratingConclusion ? 'Synthesizing...' : 'Generate Conclusion'}
                </GlowButton>

                <GlowButton
                  variant="primary"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  icon={isGeneratingReport ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  className="!py-1.5 text-xs"
                >
                  {isGeneratingReport ? 'Compiling Report...' : report ? 'View Report' : 'Generate Report'}
                </GlowButton>
              </div>
            </div>

            {/* Final Conclusion Box */}
            {conclusion ? (
              <div className="bg-black/60 border border-[#00ff99]/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#00ff99]" />
                    <h3 className="text-sm font-bold text-white uppercase">Executive Investigation Conclusion</h3>
                  </div>
                  <Badge variant={conclusion.threatLevel === 'Critical' || conclusion.threatLevel === 'High' ? 'danger' : 'cyan'}>
                    Threat Level: {conclusion.threatLevel}
                  </Badge>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                  "{conclusion.summary}"
                </p>

                {conclusion.keyTakeaways && conclusion.keyTakeaways.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-[#00ff99] font-bold uppercase tracking-wider">Key Observations & Evidence:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {conclusion.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {conclusion.recommendations && conclusion.recommendations.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Remediation Roadmap:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {conclusion.recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="bg-white/5 border border-white/5 rounded-lg p-2 text-[11px] text-slate-300 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-[#00ff99] shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center space-y-3">
                <p className="text-xs text-slate-400">
                  Click <strong className="text-[#00ff99]">"Generate Conclusion"</strong> to synthesize your objective findings into an executive threat summary.
                </p>
              </div>
            )}
          </GlassCard>

          {/* 6. DETECTIVE WALL CANVAS (PHASES 1-3) */}
          <GlassCard glow="emerald" className="p-6 relative min-h-[500px] overflow-hidden cyber-grid">
            <div className="absolute top-4 left-6 text-xs text-[#00ff99] flex items-center gap-2">
              <Pin size={14} />
              <span>
                ACTIVE CASE: <strong className="text-white">{investigation.target || investigation.domain}</strong> ({nodes.length} EVIDENCE NODES PINNED)
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
                  </g>
                );
              })}
            </svg>

            {/* Nodes Container */}
            <div className="relative z-10 pt-10 min-h-[440px]">
              {nodes.map(node => (
                <div
                  key={node.id}
                  style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                  className="absolute cursor-move transition-transform duration-75"
                >
                  <div className="bg-black/90 border border-[#00ff99]/50 rounded-xl p-3 shadow-[0_0_15px_rgba(0,255,153,0.15)] w-48 text-xs space-y-1 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <Badge variant="emerald" className="text-[9px] uppercase">{node.type}</Badge>
                      <span className="text-[10px] text-slate-400">{node.status}</span>
                    </div>
                    <div className="font-bold text-white truncate text-xs">{node.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{node.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 7. RECON INTELLIGENCE DOSSIER (PHASES 1-3) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="text-[#00ff99]" size={20} />
                RECON INTELLIGENCE DOSSIER
              </h2>
              <Badge variant="purple" className="text-xs">RAW INGESTED ARTIFACTS</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DNS Records */}
              {recon.domain && (
                <GlassCard glow="cyan" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#7efeff] flex items-center gap-2">
                      <Globe size={16} /> DNS Resolution
                    </h3>
                    <Badge variant="cyan">DNS</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Primary A Record:</span>
                      <span className="text-[#00ff99]">{recon.domain.a?.[0] || recon.domain.ip || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Nameservers:</span>
                      <span className="text-white truncate max-w-[200px]">{recon.domain.ns?.join(', ') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mail (MX):</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{recon.domain.mx?.join(', ') || 'None Exposed'}</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* SSL Certificate */}
              {recon.ssl && (
                <GlassCard glow="cyan" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#7efeff] flex items-center gap-2">
                      <Lock size={16} /> SSL/TLS Certificate
                    </h3>
                    <Badge variant="emerald">{recon.ssl.valid ? 'VALID' : 'UNVERIFIED'}</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Issuer:</span>
                      <span className="text-white truncate max-w-[200px]">
                        {typeof recon.ssl.issuer === 'object' ? (recon.ssl.issuer.O || recon.ssl.issuer.CN) : String(recon.ssl.issuer || 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Protocol:</span>
                      <span className="text-[#00ff99]">{recon.ssl.protocol || 'TLS'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Until:</span>
                      <span className="text-slate-300">{recon.ssl.validTo || 'N/A'}</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Server Headers */}
              {recon.headers && (
                <GlassCard glow="emerald" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#00ff99] flex items-center gap-2">
                      <ShieldCheck size={16} /> HTTP Headers
                    </h3>
                    <Badge variant="purple">Score: {recon.headers.score || recon.headers.grade || 'N/A'}</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Server Banner:</span>
                      <span className="text-[#7efeff]">{recon.headers.server || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">HSTS Enabled:</span>
                      <span className={recon.headers['strict-transport-security'] || recon.headers.hsts ? 'text-[#00ff99]' : 'text-rose-400'}>
                        {recon.headers['strict-transport-security'] || recon.headers.hsts ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Content Security Policy:</span>
                      <span className={recon.headers['content-security-policy'] || recon.headers.csp ? 'text-[#00ff99]' : 'text-rose-400'}>
                        {recon.headers['content-security-policy'] || recon.headers.csp ? 'Configured' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Technology Stack */}
              {recon.technology && (
                <GlassCard glow="emerald" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#00ff99] flex items-center gap-2">
                      <Cpu size={16} /> Tech Stack
                    </h3>
                    <Badge variant="cyan">COMPONENTS</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    {Array.isArray(recon.technology.categories) && recon.technology.categories.length > 0 ? (
                      recon.technology.categories.slice(0, 4).map((cat: any, cIdx: number) => (
                        <div key={cIdx} className="flex justify-between border-b border-white/10 pb-1.5">
                          <span className="text-slate-400">{cat.name}:</span>
                          <span className="text-white font-semibold">
                            {Array.isArray(cat.technologies) ? cat.technologies.map((t: any) => t.name).join(', ') : cat.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">Standard web components identified.</p>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* robots.txt */}
              {recon.robots && (
                <GlassCard glow="emerald" className="p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#00ff99] flex items-center gap-2">
                      <FileCode size={16} /> robots.txt Crawl Rules
                    </h3>
                    <Badge variant="purple">{Array.isArray(recon.robots.disallow) ? recon.robots.disallow.length : 0} Rules</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-400">Sitemaps:</span>
                      <span className="text-slate-200">{recon.robots.sitemaps || 'None Specified'}</span>
                    </div>
                    {Array.isArray(recon.robots.disallow) && recon.robots.disallow.length > 0 && (
                      <div className="pt-1">
                        <span className="text-slate-400 block mb-1.5">Disallow Endpoints:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {recon.robots.disallow.slice(0, showAllRobotsRules ? recon.robots.disallow.length : 8).map((rule: string, rIdx: number) => (
                            <span key={rIdx} className="bg-black/50 border border-white/10 rounded px-2 py-0.5 text-[#00ff99]">
                              {rule}
                            </span>
                          ))}
                        </div>
                        {recon.robots.disallow.length > 8 && (
                          <button
                            onClick={() => setShowAllRobotsRules(!showAllRobotsRules)}
                            className="mt-2 text-[#00ff99] hover:underline text-[11px] block cursor-pointer"
                          >
                            {showAllRobotsRules ? 'Show Less' : `+ ${recon.robots.disallow.length - 8} More Disallowed Rules`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <InvestigationReportModal
          report={report}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
