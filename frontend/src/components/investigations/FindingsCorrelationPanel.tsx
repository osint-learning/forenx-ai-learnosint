import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import {
  Layers,
  Sparkles,
  Pin,
  Check,
  Loader2,
} from 'lucide-react';
import { OsintService } from '../../services/api';
import type { InvestigationRecord, InvestigationFinding } from '../../types';

interface FindingsCorrelationPanelProps {
  investigation: InvestigationRecord;
  onPinFindingToGraph?: (finding: InvestigationFinding) => void;
  onFindingsUpdated?: (findings: InvestigationFinding[]) => void;
  onActionLogged?: (actionType: string, description: string, target?: string) => void;
}

export const FindingsCorrelationPanel: React.FC<FindingsCorrelationPanelProps> = ({
  investigation,
  onPinFindingToGraph,
  onFindingsUpdated,
  onActionLogged
}) => {
  const [findings, setFindings] = useState<InvestigationFinding[]>(investigation.findings || []);
  const [correlating, setCorrelating] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const handleCorrelateFindings = async () => {
    try {
      setCorrelating(true);
      const res = await OsintService.correlateInvestigationFindings(investigation._id);
      const updatedFindings = res.findings || [];
      setFindings(updatedFindings);
      onFindingsUpdated?.(updatedFindings);
      onActionLogged?.('Finding Correlation', 'Synthesized ' + updatedFindings.length + ' multi-source findings for ' + investigation.target, investigation.target);
    } catch (err) {
      console.error('Failed to correlate findings:', err);
    } finally {
      setCorrelating(false);
    }
  };

  const handlePin = (finding: InvestigationFinding, idx: number) => {
    const findingId = finding._id || ('f-' + idx);
    setPinnedIds(prev => [...prev, findingId]);
    onPinFindingToGraph?.(finding);
    onActionLogged?.('Pin Evidence', 'Pinned correlated finding to Detective Wall: ' + finding.title, finding.title);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical': return <Badge variant="danger">CRITICAL</Badge>;
      case 'High': return <Badge variant="purple">HIGH</Badge>;
      case 'Medium': return <Badge variant="cyan">MEDIUM</Badge>;
      case 'Low': return <Badge variant="emerald">LOW</Badge>;
      default: return <Badge variant="purple">INFO</Badge>;
    }
  };

  return (
    <GlassCard glow="emerald" className="p-6 border border-[#00ff99]/30 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 flex items-center justify-center text-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              FINDINGS & MULTI-SOURCE CORRELATION
              <Badge variant="emerald" className="text-[10px]">PHASE 6</Badge>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Synthesized intelligence linking DNS, SSL, Server headers, and Technology stack
            </p>
          </div>
        </div>

        <GlowButton
          variant="primary"
          onClick={handleCorrelateFindings}
          disabled={correlating}
          icon={correlating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          className="!py-1.5 text-xs font-mono"
        >
          {correlating ? 'Correlating Evidence...' : 'Correlate Findings'}
        </GlowButton>
      </div>

      {/* Findings Grid */}
      {findings.length === 0 ? (
        <div className="p-8 bg-black/40 border border-white/10 rounded-xl text-center space-y-3 font-mono">
          <Layers size={32} className="text-slate-500 mx-auto" />
          <p className="text-xs text-slate-300">No correlated findings generated yet for this case.</p>
          <GlowButton variant="primary" onClick={handleCorrelateFindings} icon={<Sparkles size={14} />}>
            Run Multi-Source Correlation
          </GlowButton>
        </div>
      ) : (
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Identified Correlated Findings ({findings.length}):</span>
            <span className="text-[#00ff99]">Click "Pin to Graph" to map findings onto the Detective Wall canvas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {findings.map((item, idx) => {
              const findingId = item._id || ('f-' + idx);
              const isPinned = pinnedIds.includes(findingId);

              return (
                <div
                  key={idx}
                  className="bg-black/60 border border-white/10 hover:border-[#00ff99]/40 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                      {getSeverityBadge(item.severity)}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <Badge variant="cyan">{item.category}</Badge>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Source: {item.source}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                    {item.relatedEvidence && item.relatedEvidence.length > 0 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Related Evidence:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedEvidence.map((ev, eIdx) => (
                            <span key={eIdx} className="bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.correlationInfo && (
                      <div className="bg-[#00ff99]/5 border border-[#00ff99]/20 rounded-lg p-2.5 text-[11px] text-slate-300">
                        <strong className="text-[#00ff99] block mb-0.5">🔗 Correlation Logic:</strong>
                        {item.correlationInfo}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Status: {item.status || 'Correlated'}</span>
                    <button
                      onClick={() => handlePin(item, idx)}
                      disabled={isPinned}
                      className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPinned
                          ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40 cursor-default'
                          : 'bg-black/80 hover:bg-[#00ff99]/20 text-slate-300 hover:text-white border border-white/20 hover:border-[#00ff99]/50'
                      }`}
                    >
                      {isPinned ? <Check size={12} className="text-[#00ff99]" /> : <Pin size={12} />}
                      {isPinned ? 'Pinned to Graph' : 'Pin to Graph'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
