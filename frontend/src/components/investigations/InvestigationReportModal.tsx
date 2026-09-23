import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import {
  FileText,
  X,
  Printer,
  CheckCircle2,
  Award,
  Globe,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import type { InvestigationReportData } from '../../types';

interface InvestigationReportModalProps {
  report: InvestigationReportData | null;
  onClose: () => void;
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const getThreatBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return <Badge variant="danger">CRITICAL THREAT</Badge>;
      case 'high': return <Badge variant="purple">HIGH THREAT</Badge>;
      case 'medium': return <Badge variant="cyan">MEDIUM THREAT</Badge>;
      default: return <Badge variant="emerald">LOW THREAT</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8">
        <GlassCard glow="cyan" className="p-6 md:p-8 border border-[#00ff99]/40 space-y-6 font-mono text-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="text-[#00ff99]" size={24} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                  {report.title || 'OSINT Intelligence Report'}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe size={13} className="text-[#00ff99]" /> Target: <strong className="text-white">{report.target}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> Generated: {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'Recent'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Print / Save PDF"
              >
                <Printer size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-black/60 hover:bg-rose-950/40 border border-white/20 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Executive Overview & Risk Badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-black/60 border border-[#00ff99]/30 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#00ff99] uppercase flex items-center gap-1.5">
                <Sparkles size={14} /> Executive Summary
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                "{report.executiveSummary}"
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center text-center space-y-2">
              <span className="text-xs text-slate-400 uppercase font-bold">Threat Posture</span>
              {getThreatBadge(report.threatLevel)}
              <div className="text-2xl font-black text-white mt-1">
                Risk Score: <span className="text-cyan-400">{report.riskScore}/100</span>
              </div>
            </div>
          </div>

          {/* Findings Summary Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                <Layers size={16} className="text-[#00ff99]" /> Correlated Security Findings ({report.keyFindings?.length || 0})
              </h3>
              {report.findingsCount && (
                <div className="flex gap-1.5 text-[10px]">
                  {report.findingsCount.critical > 0 && <Badge variant="danger">{report.findingsCount.critical} Critical</Badge>}
                  {report.findingsCount.high > 0 && <Badge variant="purple">{report.findingsCount.high} High</Badge>}
                  {report.findingsCount.medium > 0 && <Badge variant="cyan">{report.findingsCount.medium} Medium</Badge>}
                  {report.findingsCount.low > 0 && <Badge variant="emerald">{report.findingsCount.low} Low</Badge>}
                </div>
              )}
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {report.keyFindings?.map((item, idx) => (
                <div key={idx} className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.title}</span>
                    <Badge variant={item.severity === 'Critical' ? 'danger' : item.severity === 'High' ? 'purple' : 'cyan'} className="text-[9px]">
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.description}</p>
                  {item.correlationInfo && (
                    <div className="text-[10px] text-[#00ff99] pt-1">
                      🔗 <strong>Correlation:</strong> {item.correlationInfo}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Evaluation Summary */}
          {report.studentEvaluation && (
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <Award size={15} /> Student Methodology & Evaluation
                </span>
                <Badge variant="emerald">
                  Score: {report.studentEvaluation.score}% ({report.studentEvaluation.grade})
                </Badge>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                "{report.studentEvaluation.feedback}"
              </p>
            </div>
          )}

          {/* Actionable Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#00ff99] uppercase flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Recommended Remediation Steps
              </span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {report.recommendations.map((rec, rIdx) => (
                  <li key={rIdx} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-500">
              ForenX AI LearnOSINT Framework // Intelligence Artifact
            </span>
            <div className="flex gap-2">
              <GlowButton variant="secondary" onClick={handlePrint} icon={<Printer size={14} />}>
                Print Report
              </GlowButton>
              <GlowButton variant="primary" onClick={onClose}>
                Close
              </GlowButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
