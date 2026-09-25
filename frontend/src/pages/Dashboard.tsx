import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { IntelligenceCore } from '../components/intelligence/IntelligenceCore';
import { OrbitSystem } from '../components/intelligence/OrbitSystem';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { GlowButton } from '../components/ui/GlowButton';
import { OsintService } from '../services/api';
import type { PersonalizedLearningResponse } from '../types';
import {
  Sparkles,
  Bot,
  Loader2,
  TrendingUp,
  Target,
  ListOrdered
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tools, userProfile } = useApp();
  const navigate = useNavigate();

  const [learningRecs, setLearningRecs] = useState<PersonalizedLearningResponse | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      setLoadingRecs(true);
      setRecsError(null);
      const data = await OsintService.getPersonalizedLearning();
      if (data && data.success) {
        setLearningRecs(data);
      } else {
        setRecsError(data?.message || 'Failed to generate recommendations.');
      }
    } catch (err: any) {
      console.error('Personalized Learning Error:', err);
      setRecsError(err?.response?.data?.message || err?.message || 'Failed to load personalized AI learning recommendations.');
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') return;
    loadRecommendations();
  }, [user]);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Safe property extraction from backend API structure
  const recList =
    learningRecs?.recommendation?.recommendations || [];

  const learningFocus =
    learningRecs?.recommendation?.learningFocus ||
    "Personalized OSINT Pathway";

  const nextAction =
    learningRecs?.recommendation?.nextAction || "";

  const learningOrder =
    learningRecs?.recommendation?.learningOrder || [];

  const agentLevel =
    learningRecs?.studentProfile?.level ||
    userProfile.level;

  const getDifficultyBadgeVariant = (diff?: string): 'emerald' | 'cyan' | 'danger' | 'warning' => {
    const d = (diff || '').toLowerCase();
    if (d === 'advanced' || d === 'hard') return 'danger';
    if (d === 'intermediate' || d === 'medium') return 'cyan';
    return 'emerald';
  };

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

      {/* ======================================================
          AI RECOMMENDED FOR YOU (PHASE 10 PERSONALIZED LEARNING)
      ======================================================= */}
      <section className="space-y-6 pt-4 border-t border-[#00ff99]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff99] uppercase tracking-wider mb-1">
              <Bot size={15} />
              <span>AI Learning Intelligence</span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-white uppercase flex items-center gap-2">
              RECOMMENDED <span className="text-[#00ff99]">FOR YOU</span>
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Personalized roadmap dynamically tailored to your completed lessons ({userProfile.completedLessonsCount}), completed labs ({userProfile.completedLabsCount}), and current XP ({userProfile.currentXp}).
            </p>
          </div>

          <GlowButton
            variant="ghost"
            onClick={loadRecommendations}
            disabled={loadingRecs}
            icon={loadingRecs ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          >
            {loadingRecs ? 'Generating...' : 'Refresh Recommendations'}
          </GlowButton>
        </div>

        {loadingRecs && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#00ff99] font-mono text-xs">
            <Loader2 size={24} className="animate-spin" />
            <span>ForenX AI is analyzing your learning progress and generating customized guidance...</span>
          </div>
        )}

        {recsError && !loadingRecs && (
          <GlassCard className="p-4 border-red-500/30 bg-red-950/20 text-red-300 font-mono text-xs flex items-center justify-between">
            <span>{recsError}</span>
            <button
              onClick={loadRecommendations}
              className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs text-white cursor-pointer"
            >
              Retry
            </button>
          </GlassCard>
        )}

        {!loadingRecs && learningRecs && (
          <div className="space-y-6">
            {/* Learning Path & Executive Summary */}
            <GlassCard glow="emerald" className="p-5 border border-[#00ff99]/40 bg-[#021f14]/70 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#00ff99]/20">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#7efeff]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Recommended Pathway: <span className="text-[#7efeff]">{learningFocus}</span>
                  </span>
                </div>
                <Badge variant="emerald">
                  LEVEL {agentLevel} AGENT
                </Badge>
              </div>

              {nextAction && (
                <p className="text-xs font-mono text-slate-200 leading-relaxed">
                  <span className="text-[#00ff99] font-bold">Immediate Next Step: </span>
                  {nextAction}
                </p>
              )}

              {learningOrder.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[11px] font-mono text-[#7efeff] uppercase font-bold flex items-center gap-1">
                    <ListOrdered size={13} /> Recommended Order:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {learningOrder.map((step, idx) => (
                      <div key={idx} className="p-2 rounded bg-black/50 border border-white/10 font-mono text-[11px] text-slate-300">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Recommendations Grid */}
            {recList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recList.map((rec, idx) => {
                  const toolName = rec?.tool || 'OSINT Tool';
                  const toolDiff = rec?.difficulty || 'Beginner';
                  const toolReason = rec?.reason || 'Recommended based on your current skill level.';
                  return (
                    <GlassCard
                      key={idx}
                      glow="cyan"
                      className="p-5 flex flex-col justify-between border border-[#7efeff]/20 hover:border-[#00ff99] transition-all bg-[#011417]/80"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-mono font-bold text-white text-base">
                            {toolName}
                          </h4>
                          <Badge variant={getDifficultyBadgeVariant(toolDiff)}>
                            {toolDiff}
                          </Badge>
                        </div>

                        <p className="text-xs font-mono text-slate-300 leading-relaxed pt-1">
                          {toolReason}
                        </p>
                      </div>

                      <div className="pt-4 mt-2">
                        <button
                          onClick={() => navigate(`/practice-labs?tool=${encodeURIComponent(toolName)}`)}
                          className="w-full py-2 px-3 rounded-lg bg-[#00ff99]/15 border border-[#00ff99]/40 hover:bg-[#00ff99]/30 text-[#00ff99] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Target size={13} />
                          Launch {toolName} Lab
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            ) : (
              <GlassCard className="p-4 text-center font-mono text-xs text-slate-400">
                No specific tools recommended at this time.
              </GlassCard>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
