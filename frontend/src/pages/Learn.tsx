import React, { useState } from 'react';
import { INITIAL_CAPSULES } from '../constants';
import type { LearningCapsule } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { BookOpen, Clock, Award, Play, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Learn: React.FC = () => {
  const [capsules] = useState<LearningCapsule[]>(INITIAL_CAPSULES);
  const [expandedCapsuleId, setExpandedCapsuleId] = useState<string | null>(capsules[0].id);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#00ff99]/20 pb-6">
        <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
          <BookOpen className="text-[#00ff99]" size={32} />
          LEARN <span className="neon-text-emerald">OSINT</span> ACADEMY
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm mt-2">
          Structured learning capsules with interactive step-by-step intelligence gathering methodologies.
        </p>
      </div>

      {/* Learning Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capsules.map(cap => {
          const isExpanded = expandedCapsuleId === cap.id;

          return (
            <GlassCard key={cap.id} glow="emerald" className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald">{cap.difficulty}</Badge>
                    <Badge variant="cyan">{cap.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white mt-2">{cap.title}</h3>
                </div>
                <ProgressRing progress={cap.completionPercentage} size={54} strokeWidth={5} color="#00ff99" />
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {cap.description}
              </p>

              {/* Capsule Metadata Footer */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-[#7efeff]" /> {cap.durationMinutes} mins</span>
                  <span className="flex items-center gap-1"><Award size={14} className="text-[#00ff99]" /> {cap.xpReward} XP</span>
                </div>

                <button
                  onClick={() => setExpandedCapsuleId(isExpanded ? null : cap.id)}
                  className="flex items-center gap-1 text-[#00ff99] hover:underline cursor-pointer"
                >
                  {isExpanded ? 'Less Info' : 'View Syllabus'}
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expanded Syllabus Breakdown */}
              {isExpanded && (
                <div className="pt-4 border-t border-[#00ff99]/20 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-[#00ff99] uppercase">Capsule Syllabus & Objectives:</h4>
                  <div className="space-y-2">
                    {['Module 1: Passive DNS & WHOIS Redaction Parsing', 'Module 2: Certificate Transparency Logs Enumeration', 'Module 3: Subdomain Takeover Risk Assessment'].map((mod, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-white/5 text-xs font-mono text-slate-200">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#00ff99]" />
                          {mod}
                        </span>
                        <span className="text-[10px] text-[#7efeff]">15 mins</span>
                      </div>
                    ))}
                  </div>

                  <GlowButton
                    variant="primary"
                    icon={<Play size={14} />}
                    onClick={() => navigate('/lesson-viewer')}
                    className="w-full mt-2"
                  >
                    Start Capsule Lessons
                  </GlowButton>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
