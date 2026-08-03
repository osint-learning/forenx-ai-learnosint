import React from 'react';
import { useApp } from '../context/AppContext';
import { IntelligenceCore } from '../components/intelligence/IntelligenceCore';
import { OrbitSystem } from '../components/intelligence/OrbitSystem';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { Shield, Zap, Terminal, Eye, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { userProfile, tools, setSelectedTool } = useApp();
  const navigate = useNavigate();

  const xpProgressPercent = Math.min(100, Math.round((userProfile.currentXp / userProfile.nextLevelXp) * 100));

  return (
    <div className="space-y-12">
      {/* Hero Experience Section */}
      <section className="relative text-center py-6">
        {/* Holographic Header Titles */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99] text-xs font-mono mb-4 animate-pulse">
          <Sparkles size={14} />
          <span>FUTURISTIC AI-POWERED OSINT COMMAND CENTER</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white uppercase">
          CYBER INTELLIGENCE <span className="neon-text-emerald">LEARNOSINT</span>
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-mono">
          Master Open Source Intelligence techniques through interactive 3D spatial tool exploration, real-time command simulations, and practical lab missions.
        </p>

        {/* 3D Intelligence Core Centerpiece */}
        <div className="relative mt-4">
          <IntelligenceCore />
          {/* Orbital System around Intelligence Core */}
          <div className="absolute inset-0 top-12 flex items-center justify-center pointer-events-auto">
            <OrbitSystem tools={tools} />
          </div>
        </div>
      </section>

      {/* Floating Intelligence Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Learning Progress & XP */}
        <GlassCard glow="emerald" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <Zap size={16} className="text-[#00ff99]" /> Learning Progress
            </h3>
            <Badge variant="emerald">LVL {userProfile.level}</Badge>
          </div>

          <div className="flex items-center gap-4">
            <ProgressRing progress={xpProgressPercent} size={64} strokeWidth={6} color="#00ff99" />
            <div>
              <div className="text-xl font-bold font-mono text-white">{userProfile.currentXp} XP</div>
              <div className="text-xs font-mono text-slate-400">Target: {userProfile.nextLevelXp} XP</div>
              <div className="text-xs font-mono text-[#00ff99] mt-1">{userProfile.streakDays} Day Streak 🔥</div>
            </div>
          </div>
        </GlassCard>

        {/* Module 2: Mission Status */}
        <GlassCard glow="cyan" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <Shield size={16} className="text-[#7efeff]" /> Mission Status
            </h3>
            <Badge variant="cyan">Rank #{userProfile.rankPosition}</Badge>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Agent Codename:</span>
              <span className="text-white font-bold">{userProfile.codename}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Completed Labs:</span>
              <span className="text-[#00ff99] font-bold">{userProfile.completedLabsCount}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Accuracy Rating:</span>
              <span className="text-[#7efeff] font-bold">{userProfile.accuracyRate}%</span>
            </div>
          </div>
        </GlassCard>

        {/* Module 3: Threat Feed */}
        <GlassCard glow="emerald" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <Activity size={16} className="text-rose-400" /> Live Threat Feed
            </h3>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-rose-500/30 text-slate-300">
              <span className="text-rose-400 font-bold">[CRITICAL]</span> Zero-Day exploit burst detected in UK Sector.
            </div>
            <div className="p-2 rounded bg-black/40 border border-amber-500/30 text-slate-300">
              <span className="text-amber-400 font-bold">[MEDIUM]</span> SCADA Modbus unauthenticated node exposed.
            </div>
          </div>
        </GlassCard>

        {/* Module 4: Recommended Tool */}
        <GlassCard glow="cyan" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <Eye size={16} className="text-[#7efeff]" /> Recommended Tool
            </h3>
            <Badge variant="cyan">FEATURED</Badge>
          </div>

          <div>
            <h4 className="font-mono font-bold text-lg text-white">{tools[1]?.name || 'Shodan'}</h4>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-mono">{tools[1]?.tagline}</p>
          </div>

          <GlowButton
            variant="secondary"
            icon={<ChevronRight size={14} />}
            onClick={() => {
              setSelectedTool(tools[1]);
              navigate('/tool-explorer');
            }}
            className="w-full !py-1.5"
          >
            Explore Tool
          </GlowButton>
        </GlassCard>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
          onClick={() => navigate('/practice-labs')}
          glow="emerald"
          className="p-6 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#00ff99]/15 text-[#00ff99] w-fit border border-[#00ff99]/40 group-hover:scale-110 transition-transform">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold font-mono text-white group-hover:text-[#00ff99]">Practice Labs</h3>
            <p className="text-xs font-mono text-slate-400">Launch real command terminals & complete OSINT missions.</p>
          </div>
          <ChevronRight size={24} className="text-slate-500 group-hover:text-[#00ff99] group-hover:translate-x-1 transition-all" />
        </GlassCard>

        <GlassCard
          onClick={() => navigate('/recon')}
          glow="cyan"
          className="p-6 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#7efeff]/15 text-[#7efeff] w-fit border border-[#7efeff]/40 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <h3 className="text-lg font-bold font-mono text-white group-hover:text-[#7efeff]">Recon Engine</h3>
            <p className="text-xs font-mono text-slate-400">Perform animated multi-vector attack surface scans.</p>
          </div>
          <ChevronRight size={24} className="text-slate-500 group-hover:text-[#7efeff] group-hover:translate-x-1 transition-all" />
        </GlassCard>

        <GlassCard
          onClick={() => navigate('/investigations')}
          glow="emerald"
          className="p-6 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#00ff99]/15 text-[#00ff99] w-fit border border-[#00ff99]/40 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold font-mono text-white group-hover:text-[#00ff99]">Investigation Wall</h3>
            <p className="text-xs font-mono text-slate-400">Correlate evidence nodes and link graph relationships.</p>
          </div>
          <ChevronRight size={24} className="text-slate-500 group-hover:text-[#00ff99] group-hover:translate-x-1 transition-all" />
        </GlassCard>
      </section>
    </div>
  );
};
