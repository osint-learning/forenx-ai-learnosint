import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { User, Award } from 'lucide-react';
import { DynamicIcon } from '../utils/iconHelper';

export const Profile: React.FC = () => {
  const { userProfile } = useApp();

  return (
    <div className="space-y-8">
      {/* Header Profile Hero Card */}
      <GlassCard glow="emerald" className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-[#00ff99]/20 border border-[#00ff99] text-[#00ff99] shadow-[0_0_30px_rgba(0,255,153,0.4)]">
            <User size={48} />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-mono font-bold text-white tracking-wider">{userProfile.username}</h1>
              <Badge variant="emerald">LVL {userProfile.level}</Badge>
              <Badge variant="cyan">{userProfile.rank}</Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">Agent Codename: <span className="text-white font-bold">{userProfile.codename}</span></p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <ProgressRing progress={74} size={70} color="#00ff99" />
            <div className="font-mono">
              <div className="text-lg font-bold text-white">{userProfile.currentXp} XP</div>
              <div className="text-xs text-slate-400">Next: {userProfile.nextLevelXp} XP</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">
          <Award className="text-[#00ff99]" size={22} /> UNLOCKED BADGES & CERTIFICATIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userProfile.badges.map(badge => (
            <GlassCard key={badge.id} glow="cyan" className="p-5 space-y-3">
              <div className="p-3 rounded-xl bg-[#7efeff]/15 text-[#7efeff] border border-[#7efeff]/40 w-fit">
                <DynamicIcon name={badge.icon} size={24} />
              </div>
              <h4 className="font-mono font-bold text-white text-sm">{badge.name}</h4>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">{badge.description}</p>
              {badge.unlockedAt && (
                <span className="text-[10px] font-mono text-[#00ff99] block">Unlocked: {badge.unlockedAt}</span>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
