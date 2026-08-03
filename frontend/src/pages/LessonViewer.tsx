import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import { BookOpen, ChevronRight, ChevronLeft, Terminal, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LessonViewer: React.FC = () => {
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const lessons = [
    {
      title: 'Introduction to WHOIS & Registrar Redaction',
      duration: '10 mins',
      difficulty: 'Beginner',
      content: `The WHOIS protocol is a query and response protocol that is used for querying databases that store the registered users or assignees of an Internet resource, such as a domain name or IP address block.\n\nFollowing GDPR and ICANN privacy updates, registrant personal details are frequently redacted. However, examining creation dates, registrar servers, and historical name servers yields critical infrastructure intelligence.`,
      commands: [
        { cmd: 'whois target-domain.com', desc: 'Query domain registration record' },
        { cmd: 'whois -h whois.radb.net 198.51.100.0/24', desc: 'Query IP route origin' }
      ]
    },
    {
      title: 'Passive DNS & Subdomain Enumeration',
      duration: '15 mins',
      difficulty: 'Intermediate',
      content: `Subdomain enumeration is the process of finding subdomains for a domain name. It expands your target surface to locate forgotten staging servers, development endpoints, and exposed API gateways.`,
      commands: [
        { cmd: 'amass enum -passive -d target-domain.com', desc: 'Passive OSINT subdomain harvesting' }
      ]
    }
  ];

  const activeLesson = lessons[currentLessonIndex];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#00ff99]/20 pb-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-[#00ff99]" /> LESSON VIEWER
          </h1>
          <p className="text-xs font-mono text-slate-400">Course: Domain Infrastructure Footprinting</p>
        </div>
        <GlowButton variant="secondary" onClick={() => navigate('/practice-labs')}>
          Launch Mission Lab
        </GlowButton>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Course Sidebar */}
        <GlassCard glow="cyan" className="lg:col-span-1 p-4 space-y-4">
          <h3 className="font-mono font-bold text-xs text-[#7efeff] uppercase">Course Curriculum</h3>
          <div className="space-y-2">
            {lessons.map((les, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentLessonIndex(idx)}
                className={`p-3 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  currentLessonIndex === idx
                    ? 'bg-[#00ff99]/20 border-[#00ff99] text-[#00ff99] font-bold'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:border-[#00ff99]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Lesson {idx + 1}</span>
                  <span className="text-[10px] opacity-70">{les.duration}</span>
                </div>
                <div className="mt-1 text-white text-xs font-semibold">{les.title}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right Column: Lesson Body */}
        <GlassCard glow="emerald" className="lg:col-span-3 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold font-mono text-white">{activeLesson.title}</h2>
            <Badge variant="emerald">{activeLesson.difficulty}</Badge>
          </div>

          <div className="prose prose-invert text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {activeLesson.content}
          </div>

          {/* Commands Cheat Sheet */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#00ff99] uppercase flex items-center gap-2">
              <Terminal size={14} /> Recommended Terminal Syntax
            </h4>
            {activeLesson.commands.map((c, i) => (
              <div key={i} className="bg-black/80 p-3 rounded-lg border border-[#00ff99]/30 font-mono text-xs space-y-1">
                <div className="text-slate-400 text-[11px]">{c.desc}</div>
                <div className="text-[#00ff99] flex items-center justify-between">
                  <code>${c.cmd}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(c.cmd);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="p-1 rounded bg-white/10 text-white hover:text-[#00ff99] cursor-pointer"
                  >
                    {copiedCode ? <Check size={14} className="text-[#00ff99]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <GlowButton
              variant="ghost"
              disabled={currentLessonIndex === 0}
              onClick={() => setCurrentLessonIndex(prev => prev - 1)}
              icon={<ChevronLeft size={14} />}
            >
              Previous Lesson
            </GlowButton>

            <GlowButton
              variant="primary"
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() => setCurrentLessonIndex(prev => prev + 1)}
              icon={<ChevronRight size={14} />}
            >
              Next Lesson
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
