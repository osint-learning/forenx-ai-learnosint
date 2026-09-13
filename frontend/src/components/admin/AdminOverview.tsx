import React from 'react';
import type { AdminOverview as AdminOverviewType } from '../../types';
import type { AdminTab } from './AdminSidebar';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Wrench,
  BookOpen,
  HelpCircle,
  FlaskConical,
  Shield,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface AdminOverviewProps {
  overview: AdminOverviewType | null;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ overview, onNavigateTab }) => {
  if (!overview) return null;

  const statCards = [
    {
      title: 'TOTAL USERS',
      value: overview.users.total,
      description: 'Registered accounts',
      icon: <Users size={22} className="text-[#00ff99]" />,
      badge: 'ALL',
      badgeColor: 'text-[#00ff99] bg-[#00ff99]/10',
    },
    {
      title: 'STUDENTS',
      value: overview.users.students,
      description: 'Active learners',
      icon: <Users size={22} className="text-cyan-400" />,
      badge: 'LEARNERS',
      badgeColor: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      title: 'ADMINISTRATORS',
      value: overview.users.admins,
      description: 'Security clearance',
      icon: <ShieldAlert size={22} className="text-purple-400" />,
      badge: 'ELEVATED',
      badgeColor: 'text-purple-400 bg-purple-500/10',
    },
    {
      title: 'VERIFIED STUDENTS',
      value: overview.users.verifiedStudents,
      description: 'Email confirmed',
      icon: <UserCheck size={22} className="text-emerald-400" />,
      badge: 'VERIFIED',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'OSINT TOOLS',
      value: overview.learning.tools,
      description: 'Intelligence suite',
      icon: <Wrench size={22} className="text-[#00ff99]" />,
      badge: 'CATALOG',
      badgeColor: 'text-[#00ff99] bg-[#00ff99]/10',
    },
    {
      title: 'LESSONS',
      value: overview.learning.lessons,
      description: 'Interactive capsules',
      icon: <BookOpen size={22} className="text-cyan-400" />,
      badge: 'MODULES',
      badgeColor: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      title: 'QUIZ QUESTIONS',
      value: overview.learning.quizzes,
      description: 'Knowledge validation',
      icon: <HelpCircle size={22} className="text-amber-400" />,
      badge: 'ASSESSMENT',
      badgeColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'PRACTICE LABS',
      value: overview.learning.labs,
      description: 'Virtual environments',
      icon: <FlaskConical size={22} className="text-rose-400" />,
      badge: 'PRACTICAL',
      badgeColor: 'text-rose-400 bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 8 Metric KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#080808]/80 p-5 hover:border-[#00ff99]/40 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 ${card.badgeColor}`}>
                  {card.badge}
                </span>
                <p className="text-xs font-mono text-slate-400 mt-2">{card.title}</p>
                <p className="text-3xl font-black font-mono text-white tracking-tight">{card.value}</p>
                <p className="text-[11px] font-mono text-slate-500">{card.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Status & Action Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* User Summary Widget */}
        <div className="rounded-xl border border-white/10 bg-[#080808]/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ff99] flex items-center gap-2">
              <Users size={14} />
              User Demographics
            </h3>
            <span className="text-[10px] font-mono text-slate-500">LIVE SYNC</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400">Total Registered</span>
              <span className="font-bold text-white text-sm">{overview.users.total}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400">Active Students</span>
              <span className="font-bold text-[#00ff99] text-sm">{overview.users.students}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400">Administrators</span>
              <span className="font-bold text-purple-400 text-sm">{overview.users.admins}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400">Verified Ratio</span>
              <span className="font-bold text-emerald-400 text-sm">
                {overview.users.students > 0
                  ? Math.round((overview.users.verifiedStudents / overview.users.students) * 100) + "%"
                  : '0%'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('students')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#00ff99]/30 bg-[#00ff99]/10 text-xs font-mono text-[#00ff99] hover:bg-[#00ff99]/20 transition-all cursor-pointer"
          >
            <span>Manage All Students</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Learning Platform Status */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#080808]/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Shield size={14} />
              Curriculum & Content Inventory
            </h3>
            <span className="text-[10px] font-mono text-slate-500">REALTIME DB</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => onNavigateTab('tools')}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ff99]/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-mono">Tools</span>
                <Wrench size={13} />
              </div>
              <p className="text-2xl font-black font-mono text-white">{overview.learning.tools}</p>
              <span className="text-[10px] font-mono text-[#00ff99]">Manage &rarr;</span>
            </div>

            <div
              onClick={() => onNavigateTab('lessons')}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-mono">Lessons</span>
                <BookOpen size={13} />
              </div>
              <p className="text-2xl font-black font-mono text-white">{overview.learning.lessons}</p>
              <span className="text-[10px] font-mono text-cyan-400">Manage &rarr;</span>
            </div>

            <div
              onClick={() => onNavigateTab('quizzes')}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-mono">Quizzes</span>
                <HelpCircle size={13} />
              </div>
              <p className="text-2xl font-black font-mono text-white">{overview.learning.quizzes}</p>
              <span className="text-[10px] font-mono text-amber-400">Manage &rarr;</span>
            </div>

            <div
              onClick={() => onNavigateTab('labs')}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-rose-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-mono">Labs</span>
                <FlaskConical size={13} />
              </div>
              <p className="text-2xl font-black font-mono text-white">{overview.learning.labs}</p>
              <span className="text-[10px] font-mono text-rose-400">Manage &rarr;</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#00ff99]/5 border border-[#00ff99]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-[#00ff99]" />
              <div>
                <p className="text-xs font-mono font-bold text-white">Platform Health: Optimal</p>
                <p className="text-[10px] font-mono text-slate-400">All learning pipelines, sandbox terminals, and database services are operational.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-white hover:bg-white/20 transition-all shrink-0 cursor-pointer"
            >
              View Analytics
            </button>
          </div>
        </div>

      </section>

      {/* Recent Students Section */}
      <section className="rounded-xl border border-white/10 bg-[#080808]/80 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#00ff99]">AUDIT LOG // RECENT ENROLLMENTS</p>
            <h2 className="text-lg font-bold font-mono text-white mt-0.5">Recent Students</h2>
          </div>
          <button
            onClick={() => onNavigateTab('students')}
            className="text-xs font-mono text-[#00ff99] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {overview.recentStudents?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-slate-500 uppercase text-[10px]">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">XP Earned</th>
                  <th className="px-5 py-3">Verification</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {overview.recentStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{student.fullName}</p>
                      <p className="text-[11px] text-slate-500">{student.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 text-[10px]">
                        LVL {student.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-bold">{student.xp} XP</td>
                    <td className="px-5 py-3.5">
                      {student.isVerified ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          UNVERIFIED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onNavigateTab('students')}
                        className="px-2.5 py-1 rounded bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-[11px] border border-white/10 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">No recent students found.</div>
        )}
      </section>

    </div>
  );
};
