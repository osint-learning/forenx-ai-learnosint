import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  History,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { OsintService } from '../../services/api';
import type { InvestigationRecord, InvestigationEvaluation, InvestigationAction } from '../../types';

interface StudentEvaluationPanelProps {
  investigation: InvestigationRecord;
  onActionLogged?: (actionType: string, description: string, target?: string) => void;
}

export const StudentEvaluationPanel: React.FC<StudentEvaluationPanelProps> = ({
  investigation,
  onActionLogged
}) => {
  const [evaluation, setEvaluation] = useState<InvestigationEvaluation>(
    investigation.evaluation || {
      score: 20,
      grade: 'In Progress',
      methodology: 'NIST / OSINT Reconnaissance Framework',
      strengths: ['Initial Reconnaissance baseline ingested.'],
      improvements: ['Complete objective milestones and correlate findings.'],
      feedback: 'Investigation active. Continue exploring DNS, SSL, and server headers.',
    }
  );

  const [actions] = useState<InvestigationAction[]>(investigation.studentActions || []);
  const [reEvaluating, setReEvaluating] = useState(false);

  const handleReEvaluate = async () => {
    try {
      setReEvaluating(true);
      const res = await OsintService.getInvestigationEvaluation(investigation._id);
      if (res) {
        setEvaluation(res);
      }
      onActionLogged?.('Evaluation Refresh', 'Recalculated student methodology score and feedback', investigation.target);
    } catch (err) {
      console.error('Failed to re-evaluate:', err);
    } finally {
      setReEvaluating(false);
    }
  };

  const getGradeBadge = (grade: string) => {
    if (grade.includes('A')) return <Badge variant="emerald">{grade}</Badge>;
    if (grade.includes('B')) return <Badge variant="cyan">{grade}</Badge>;
    return <Badge variant="purple">{grade}</Badge>;
  };

  return (
    <GlassCard glow="cyan" className="p-6 border border-[#00ff99]/30 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 flex items-center justify-center text-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]">
            <Award size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              STUDENT INVESTIGATION EVALUATION & FEEDBACK
              <Badge variant="emerald" className="text-[10px]">PHASE 7</Badge>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Automated methodology scoring, strength analysis, and educational guidance
            </p>
          </div>
        </div>

        <GlowButton
          variant="secondary"
          onClick={handleReEvaluate}
          disabled={reEvaluating}
          icon={reEvaluating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          className="!py-1.5 text-xs font-mono"
        >
          {reEvaluating ? 'Evaluating...' : 'Refresh Score'}
        </GlowButton>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Left Column: Score Card */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-5 space-y-4 text-center flex flex-col justify-center items-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Investigation Grade</span>
          
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-black/80 border-4 border-[#00ff99]/40 shadow-[0_0_20px_rgba(0,255,153,0.2)]">
            <div className="text-center">
              <span className="text-3xl font-black text-white">{evaluation.score}%</span>
              <span className="block text-[10px] text-[#00ff99] font-bold uppercase">SCORE</span>
            </div>
          </div>

          <div className="space-y-1">
            {getGradeBadge(evaluation.grade)}
            <span className="block text-[11px] text-slate-400 mt-1">{evaluation.methodology}</span>
          </div>
        </div>

        {/* Center & Right Column: Strengths & Improvements */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Educational Feedback */}
          <div className="bg-black/60 border border-[#00ff99]/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00ff99] uppercase">
              <ShieldCheck size={14} /> AI Evaluator Feedback
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
              "{evaluation.feedback}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5 text-xs">
                <CheckCircle2 size={14} /> Demonstrated Strengths:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5 space-y-2">
              <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 text-xs">
                <TrendingUp size={14} /> Next Improvement Steps:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action History Timeline */}
      {actions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase">
            <History size={14} className="text-[#00ff99]" /> Investigation Action Log ({actions.length})
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {actions.slice(-6).reverse().map((act, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Badge variant="purple" className="text-[9px] shrink-0">{act.actionType}</Badge>
                  <span className="truncate text-slate-200">{act.description}</span>
                </div>
                {act.timestamp && (
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                    {new Date(act.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
