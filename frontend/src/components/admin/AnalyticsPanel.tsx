import React, { useState, useEffect } from 'react';
import { OsintService } from '../../services/api';
import type { AdminAnalytics } from '../../types';
import { BarChart3, TrendingUp, Zap, Award, CheckCircle, BookOpen, FlaskConical, ShieldCheck } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await OsintService.getAdminAnalytics();
        setAnalytics(data);
      } catch (err: any) {
        console.error('Fetch analytics error:', err);
        setError(err?.response?.data?.message || 'Failed to load system analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
        <span className="w-6 h-6 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin" />
        <span>COMPUTING PLATFORM TELEMETRY & ANALYTICS...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 text-center text-rose-400 font-mono text-xs rounded-xl border border-rose-500/20 bg-rose-500/5">
        {error || 'Unable to load analytics data.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[#00ff99]">TELEMETRY // PLATFORM ANALYTICS</p>
        <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
          <BarChart3 size={20} className="text-[#00ff99]" />
          System Analytics & Intelligence
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Total XP Earned</span>
            <Zap size={16} className="text-[#00ff99]" />
          </div>
          <p className="text-3xl font-black font-mono text-[#00ff99]">{analytics.students.totalXp.toLocaleString()} XP</p>
          <p className="text-[10px] font-mono text-slate-500">Avg {analytics.students.avgXp} XP / learner</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Lesson Completions</span>
            <BookOpen size={16} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black font-mono text-cyan-400">{analytics.engagement.totalLessonsCompleted}</p>
          <p className="text-[10px] font-mono text-slate-500">Interactive modules passed</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Lab Completions</span>
            <FlaskConical size={16} className="text-rose-400" />
          </div>
          <p className="text-3xl font-black font-mono text-rose-400">{analytics.engagement.totalLabsCompleted}</p>
          <p className="text-[10px] font-mono text-slate-500">Virtual hands-on objectives solved</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Verification Rate</span>
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400">
            {analytics.students.total > 0
              ? Math.round((analytics.students.verified / analytics.students.total) * 100) + '%'
              : '0%'}
          </p>
          <p className="text-[10px] font-mono text-slate-500">{analytics.students.verified} of {analytics.students.total} verified</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Award size={15} />
              Agent Level Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-500">COHORT PROGRESS</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {[
              { level: 'Level 1 (Novice)', count: analytics.students.levelDistribution.level1, color: 'bg-slate-400' },
              { level: 'Level 2 (Investigator)', count: analytics.students.levelDistribution.level2, color: 'bg-[#00ff99]' },
              { level: 'Level 3 (Specialist)', count: analytics.students.levelDistribution.level3, color: 'bg-cyan-400' },
              { level: 'Level 4 (Operative)', count: analytics.students.levelDistribution.level4, color: 'bg-purple-400' },
              { level: 'Level 5+ (Cyber Commander)', count: analytics.students.levelDistribution.level5Plus, color: 'bg-amber-400' },
            ].map((item) => {
              const percent = analytics.students.total > 0 ? (item.count / analytics.students.total) * 100 : 0;
              return (
                <div key={item.level} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{item.level}</span>
                    <span className="text-slate-400 font-bold">{item.count} ({Math.round(percent)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: Math.max(percent, 3) + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ff99] flex items-center gap-2">
              <TrendingUp size={15} />
              Top XP Operators
            </h3>
            <span className="text-[10px] font-mono text-slate-500">TOP 5</span>
          </div>
          <div className="space-y-2">
            {analytics.students.topStudents?.length ? (
              analytics.students.topStudents.map((student, idx) => (
                <div key={student._id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${idx === 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' : idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' : 'bg-white/5 text-slate-400'}`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white text-xs">{student.fullName}</p>
                      <p className="text-[10px] text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00ff99] font-bold">{student.xp} XP</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">LVL {student.level}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 font-mono text-xs text-center py-6">No ranking telemetry available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-white/10 bg-[#080808]/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <ShieldCheck size={15} />
            Intelligence Tools by Investigation Vector
          </h3>
          <span className="text-[10px] font-mono text-slate-500">COVERAGE</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(analytics.content.toolsByCategory || {}).map(([cat, count]) => (
            <div key={cat} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 font-mono">
              <p className="text-[10px] text-slate-400 truncate">{cat}</p>
              <p className="text-xl font-bold text-white mt-1">{count} tools</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};