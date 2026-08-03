import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_LABS } from '../constants';
import type { PracticeLab } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { InteractiveTerminal } from '../components/terminal/InteractiveTerminal';
import { Terminal, Award, CheckCircle2, HelpCircle, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticeLabs: React.FC = () => {
  const { completeLab, completedLabIds } = useApp();
  const [activeLab, setActiveLab] = useState<PracticeLab>(INITIAL_LABS[0]);
  const [objectivesState, setObjectivesState] = useState(activeLab.objectives);
  const [activeLeftTab, setActiveLeftTab] = useState<'brief' | 'evidence' | 'hints'>('brief');
  const [isLabCompleted, setIsLabCompleted] = useState(completedLabIds.includes(activeLab.id));

  const handleCommandExecution = (cmd: string) => {
    const lower = cmd.toLowerCase();

    // Check if command matches any objective
    const updated = objectivesState.map(obj => {
      if (obj.requiredCommandPattern && lower.includes(obj.requiredCommandPattern.toLowerCase())) {
        return { ...obj, completed: true };
      }
      return obj;
    });

    setObjectivesState(updated);

    // Check if all objectives are completed
    if (updated.every(o => o.completed) && !isLabCompleted) {
      setIsLabCompleted(true);
      completeLab(activeLab.id, activeLab.xpReward);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Mission Select Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00ff99]/20 pb-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
            <Terminal className="text-[#00ff99]" size={32} />
            PRACTICE LABS <span className="neon-text-emerald">// MISSION CONTROL</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Real interactive command terminal simulations & live objective verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {INITIAL_LABS.map(lab => (
            <button
              key={lab.id}
              onClick={() => {
                setActiveLab(lab);
                setObjectivesState(lab.objectives);
                setIsLabCompleted(completedLabIds.includes(lab.id));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                activeLab.id === lab.id
                  ? 'bg-[#00ff99]/20 border-[#00ff99] text-[#00ff99] font-bold'
                  : 'bg-black/60 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {lab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Split Mission Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Mission Brief & Objectives (5 Cols) */}
        <GlassCard glow="emerald" className="lg:col-span-5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="emerald">{activeLab.difficulty}</Badge>
              <h2 className="text-xl font-mono font-bold text-white mt-1">{activeLab.title}</h2>
              <span className="text-xs font-mono text-[#7efeff]">Target: {activeLab.targetDomainOrIp}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#00ff99] font-bold flex items-center gap-1">
                <Award size={16} /> +{activeLab.xpReward} XP
              </span>
            </div>
          </div>

          {/* Left Tabs */}
          <div className="flex border-b border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveLeftTab('brief')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'brief' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400'
              }`}
            >
              Mission Brief
            </button>
            <button
              onClick={() => setActiveLeftTab('evidence')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'evidence' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400'
              }`}
            >
              Evidence ({activeLab.evidenceFiles.length})
            </button>
            <button
              onClick={() => setActiveLeftTab('hints')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'hints' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400'
              }`}
            >
              Hints
            </button>
          </div>

          {activeLeftTab === 'brief' && (
            <div className="space-y-4">
              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {activeLab.missionBrief}
              </p>

              {/* Objectives Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#00ff99] uppercase">Mission Objectives</h4>
                {objectivesState.map((obj) => (
                  <div
                    key={obj.id}
                    className={`p-3 rounded-lg border font-mono text-xs flex items-start gap-3 transition-all ${
                      obj.completed
                        ? 'bg-[#00ff99]/15 border-[#00ff99] text-white'
                        : 'bg-black/60 border-white/10 text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      size={18}
                      className={obj.completed ? 'text-[#00ff99] shrink-0 mt-0.5' : 'text-slate-600 shrink-0 mt-0.5'}
                    />
                    <div>
                      <div className="font-bold">{obj.task}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Hint: {obj.hint}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLeftTab === 'evidence' && (
            <div className="space-y-3">
              {activeLab.evidenceFiles.map((file, i) => (
                <div key={i} className="bg-black/80 p-3 rounded border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#7efeff]">
                    <FileText size={14} />
                    <span className="font-bold">{file.name}</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 bg-white/5 p-2 rounded whitespace-pre-wrap">
                    {file.content}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeLeftTab === 'hints' && (
            <div className="space-y-2 font-mono text-xs">
              {activeLab.hints.map((hint, i) => (
                <div key={i} className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2">
                  <HelpCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}

          {isLabCompleted && (
            <div className="p-4 rounded-xl bg-[#00ff99]/20 border border-[#00ff99] text-center font-mono space-y-2 animate-bounce">
              <Sparkles size={24} className="mx-auto text-[#00ff99]" />
              <div className="text-lg font-bold text-white">MISSION ACCOMPLISHED!</div>
              <div className="text-xs text-[#00ff99]">You earned +{activeLab.xpReward} XP for completing this lab!</div>
            </div>
          )}
        </GlassCard>

        {/* Right Side: Integrated Terminal (7 Cols) */}
        <div className="lg:col-span-7 h-[580px]">
          <InteractiveTerminal
            initialTarget={activeLab.targetDomainOrIp}
            onCommandRun={handleCommandExecution}
          />
        </div>
      </div>
    </div>
  );
};
