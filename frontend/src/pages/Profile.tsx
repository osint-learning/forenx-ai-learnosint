import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { OsintService } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import type { UserProfile } from '../types';
import {
  User,
  Award,
  Shield,
  BookOpen,
  FlaskConical,
  Mail,
  Calendar,
  Activity,
  CheckCircle2,
  Terminal,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Compass,
  ArrowRight,
  Zap
} from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { userProfile: contextProfile } = useApp();

  const [profileData, setProfileData] = useState<UserProfile>(contextProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [completedLabsList, setCompletedLabsList] = useState<any[]>([]);
  const [completedLessonsList, setCompletedLessonsList] = useState<any[]>([]);

  // ---------------------------------------------------------
  // FETCH REAL DATABASE PROFILE ON MOUNT
  // ---------------------------------------------------------
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await OsintService.getMyProfile();

      if (response?.success && response?.data) {
        const u = response.data;
        const mappedProfile: UserProfile = {
          username: u.fullName || authUser?.fullName || 'Anonymous Operative',
          email: u.email || authUser?.email || '',
          role: u.role || authUser?.role || 'student',
          level: u.level ?? authUser?.level ?? 1,
          currentXp: u.xp ?? authUser?.xp ?? 0,
          completedLabsCount: Array.isArray(u.completedLabs) ? u.completedLabs.length : 0,
          completedLessonsCount: Array.isArray(u.completedLessons) ? u.completedLessons.length : 0,
          badges: Array.isArray(u.badges) ? u.badges : [],
          createdAt: u.createdAt || '',
          nextLevelXp: (u.level || 1) * 1000,
          streakDays: 3,
          rankPosition: 1,
          codename: (u.fullName || 'OPERATIVE').toUpperCase().replace(/\s+/g, '_'),
          accuracyRate: 98,
          profileImage: u.profileImage || '',
          isVerified: Boolean(u.isVerified),
          completedLessons: Array.isArray(u.completedLessons) ? u.completedLessons : [],
          completedLabs: Array.isArray(u.completedLabs) ? u.completedLabs : []
        };

        setProfileData(mappedProfile);
        setCompletedLabsList(Array.isArray(u.completedLabs) ? u.completedLabs : []);
        setCompletedLessonsList(Array.isArray(u.completedLessons) ? u.completedLessons : []);
      } else {
        // Fallback to existing context profile
        setProfileData(contextProfile);
      }
    } catch (err: any) {
      console.error('Failed to load user profile:', err);
      // If error, fall back to context state gracefully
      if (contextProfile && contextProfile.username) {
        setProfileData(contextProfile);
      } else {
        setError(err?.response?.data?.message || 'Failed to load user profile from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update when contextProfile changes (e.g. after lab completion)
  useEffect(() => {
    if (contextProfile && contextProfile.username) {
      setProfileData(prev => ({
        ...prev,
        currentXp: contextProfile.currentXp,
        level: contextProfile.level,
        completedLabsCount: contextProfile.completedLabsCount,
        completedLessonsCount: contextProfile.completedLessonsCount,
        badges: contextProfile.badges.length > 0 ? contextProfile.badges : prev.badges
      }));
    }
  }, [contextProfile]);

  // =========================================================
  // DERIVED DATA & METRICS
  // =========================================================
  const fullName = profileData.username || authUser?.fullName || 'Operative';
  const email = profileData.email || authUser?.email || 'Unavailable';
  const role = (profileData.role || authUser?.role || 'student').toLowerCase();
  const isAdmin = role === 'admin';
  const displayRole = isAdmin ? 'ADMINISTRATOR' : 'STUDENT OPERATIVE';

  const currentXp = profileData.currentXp ?? 0;
  const level = profileData.level ?? 1;
  const nextLevelXp = level * 1000;
  const xpProgress = Math.min(Math.round((currentXp / Math.max(nextLevelXp, 1)) * 100), 100);

  const completedLabs = profileData.completedLabsCount ?? 0;
  const completedLessons = profileData.completedLessonsCount ?? 0;
  const badges = profileData.badges || [];
  const isVerified = Boolean(profileData.isVerified);

  const formattedCreatedAt = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Session';

  const rankTitle =
    level >= 10
      ? 'MASTER OSINT COMMANDER'
      : level >= 6
      ? 'SENIOR THREAT ANALYST'
      : level >= 3
      ? 'OSINT INVESTIGATION SPECIALIST'
      : 'JUNIOR OSINT OPERATIVE';

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading && !profileData.username) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Terminal size={42} className="mx-auto text-[#00ff99] animate-pulse" />
          <div className="text-xl font-mono font-bold text-white tracking-wider">
            DECRYPTING OPERATIVE PROFILE...
          </div>
          <p className="text-xs font-mono text-slate-400">
            Fetching authenticated intelligence profile from database.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE (Only if no data available)
  // =========================================================
  if (error && !profileData.username && !authUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlassCard glow="cyan" className="p-8 max-w-md text-center space-y-4">
          <AlertCircle size={42} className="mx-auto text-rose-400" />
          <h2 className="text-lg font-mono font-bold text-white">PROFILE LOAD ERROR</h2>
          <p className="text-xs font-mono text-rose-300">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99] font-mono text-xs font-bold hover:bg-[#00ff99]/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw size={14} />
            RETRY CONNECTION
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* =====================================================
          PAGE HEADER / BANNER
      ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00ff99]/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/30 text-[#00ff99] text-xs font-mono mb-2">
            <Shield size={13} />
            <span>AUTHENTICATED DOSSIER // CLASSIFIED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight flex items-center gap-3">
            STUDENT <span className="neon-text-emerald">PROFILE</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Real-time cybersecurity credentials, investigation records, and learning telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={14} />
              ADMIN DASHBOARD
            </button>
          )}

          <button
            onClick={fetchUserProfile}
            title="Refresh profile data"
            className="p-2.5 rounded-lg border border-white/10 bg-black/40 text-slate-400 hover:text-[#00ff99] hover:border-[#00ff99]/40 transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* =====================================================
          PROFILE HEADER CARD
      ====================================================== */}
      <GlassCard glow="emerald" className="p-6 sm:p-8 relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff99]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
          {/* AVATAR + IDENTITY */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#052d1d] to-black border-2 border-[#00ff99] flex items-center justify-center text-[#00ff99] shadow-[0_0_35px_rgba(0,255,153,0.35)] overflow-hidden">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={54} className="text-[#00ff99]" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-black border border-[#00ff99] text-[#00ff99] font-mono text-[10px] font-bold shadow-lg">
                LVL {level}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wide">
                  {fullName}
                </h2>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00ff99] border border-[#00ff99]/30 bg-[#00ff99]/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} />
                    VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="text-xs font-mono font-bold text-[#00ff99] tracking-wider">
                {rankTitle}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield size={13} className="text-[#7efeff]" />
                  {displayRole}
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#7efeff]" />
                  Joined {formattedCreatedAt}
                </span>
              </div>
            </div>
          </div>

          {/* XP & PROGRESS TELEMETRY */}
          <div className="w-full lg:w-auto min-w-[280px] bg-black/60 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 font-mono">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  TOTAL EXPERIENCE
                </div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap size={20} className="text-[#00ff99]" />
                  {currentXp.toLocaleString()} <span className="text-xs text-[#00ff99]">XP</span>
                </div>
              </div>

              <div className="shrink-0">
                <ProgressRing progress={xpProgress} size={64} color="#00ff99" />
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Level {level} Progress</span>
                <span className="text-[#00ff99] font-bold">{xpProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00ff99] to-[#7efeff] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,153,0.5)]"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{currentXp} XP</span>
                <span>Next Rank: {nextLevelXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* =====================================================
          ACCOUNT INFORMATION GRID
      ====================================================== */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2">
          <Shield className="text-[#00ff99]" size={20} />
          ACCOUNT & SECURITY CREDENTIALS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* EMAIL */}
          <GlassCard glow="cyan" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Mail size={16} className="text-[#7efeff]" />
              <span>AUTHENTICATED EMAIL</span>
            </div>
            <p className="text-sm font-mono font-bold text-white truncate" title={email}>
              {email}
            </p>
            <div className="text-[10px] font-mono text-[#00ff99]">
              Primary Login Identifier
            </div>
          </GlassCard>

          {/* ROLE */}
          <GlassCard glow="emerald" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Shield size={16} className="text-[#00ff99]" />
              <span>ACCESS ROLE</span>
            </div>
            <p className="text-base font-mono font-bold text-white">
              {displayRole}
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              {isAdmin ? 'System Administrator Clearance' : 'Standard Student Access'}
            </div>
          </GlassCard>

          {/* MEMBER SINCE */}
          <GlassCard glow="cyan" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Calendar size={16} className="text-[#7efeff]" />
              <span>REGISTRATION DATE</span>
            </div>
            <p className="text-sm font-mono font-bold text-white">
              {formattedCreatedAt}
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              Account Onboarding
            </div>
          </GlassCard>

          {/* STATUS */}
          <GlassCard glow="emerald" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <ShieldCheck size={16} className="text-[#00ff99]" />
              <span>STATUS</span>
            </div>
            <p className="text-base font-mono font-bold text-[#00ff99] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff99] animate-ping" />
              ACTIVE OPERATIVE
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              System Authorized
            </div>
          </GlassCard>
        </div>
      </div>

      {/* =====================================================
          LEARNING & INVESTIGATION PROGRESS
      ====================================================== */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2">
          <Activity className="text-[#00ff99]" size={20} />
          LEARNING & INVESTIGATION TELEMETRY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL XP */}
          <GlassCard glow="emerald" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Total XP Earned
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {currentXp}
              </div>
              <div className="text-[10px] font-mono text-[#00ff99]">
                Live Experience Metric
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30">
              <Zap size={24} />
            </div>
          </GlassCard>

          {/* CURRENT LEVEL */}
          <GlassCard glow="cyan" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Current Level
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {level}
              </div>
              <div className="text-[10px] font-mono text-[#7efeff]">
                {rankTitle.split('//')[0] || 'Operative Rank'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#7efeff]/10 text-[#7efeff] border border-[#7efeff]/30">
              <Award size={24} />
            </div>
          </GlassCard>

          {/* COMPLETED LESSONS */}
          <GlassCard glow="cyan" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Lessons Completed
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {completedLessons}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Out of 312 Lessons
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <BookOpen size={24} />
            </div>
          </GlassCard>

          {/* COMPLETED LABS */}
          <GlassCard glow="emerald" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Practice Labs Completed
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {completedLabs}
              </div>
              <div className="text-[10px] font-mono text-[#00ff99]">
                Out of 39 Practice Labs
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30">
              <FlaskConical size={24} />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* =====================================================
          ACHIEVEMENTS / BADGES
      ====================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2">
            <Award className="text-[#00ff99]" size={20} />
            UNLOCKED BADGES & CERTIFICATIONS ({badges.length})
          </h3>
        </div>

        {badges.length === 0 ? (
          <GlassCard glow="cyan" className="p-8 text-center space-y-3">
            <Award className="mx-auto text-slate-600" size={44} />
            <h4 className="font-mono font-bold text-white text-base">
              NO BADGES UNLOCKED YET
            </h4>
            <p className="text-xs font-mono text-slate-400 max-w-lg mx-auto leading-relaxed">
              Complete lessons, practice labs, and reconnaissance missions to earn certified OSINT achievement badges.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/practice-labs')}
                className="px-4 py-2 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/30 text-[#00ff99] font-mono text-xs font-bold hover:bg-[#00ff99]/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical size={14} />
                ENTER PRACTICE LABS
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <GlassCard
                key={`${badge}-${idx}`}
                glow="cyan"
                className="p-5 space-y-3 border-l-4 border-l-[#00ff99]"
              >
                <div className="p-3 rounded-xl bg-[#00ff99]/15 text-[#00ff99] border border-[#00ff99]/30 w-fit">
                  <Award size={22} />
                </div>
                <h4 className="font-mono font-bold text-white text-sm">
                  {badge}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                  Certified competency unlocked via ForenX AI LearnOSINT.
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          COMPLETED MISSIONS & ACTIVITY
      ====================================================== */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2">
          <Terminal className="text-[#00ff99]" size={20} />
          COMPLETED MISSIONS & INVESTIGATION LOG
        </h3>

        {completedLabsList.length > 0 || completedLessonsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Completed Labs List */}
            {completedLabsList.length > 0 && (
              <GlassCard glow="emerald" className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono font-bold text-[#00ff99] flex items-center gap-2">
                    <FlaskConical size={14} />
                    COMPLETED PRACTICE LABS ({completedLabsList.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {completedLabsList.map((lab: any, i: number) => (
                    <div
                      key={lab._id || i}
                      className="p-2.5 rounded-lg bg-black/60 border border-[#00ff99]/20 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#00ff99] shrink-0" />
                        <span className="text-white font-bold truncate max-w-[200px]">
                          {typeof lab === 'string' ? lab : lab.title || lab.tool || 'Practice Lab'}
                        </span>
                      </div>
                      {typeof lab === 'object' && lab.difficulty && (
                        <Badge variant="emerald" size="sm">
                          {lab.difficulty}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Completed Lessons List */}
            {completedLessonsList.length > 0 && (
              <GlassCard glow="cyan" className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono font-bold text-[#7efeff] flex items-center gap-2">
                    <BookOpen size={14} />
                    COMPLETED LESSONS ({completedLessonsList.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {completedLessonsList.map((lesson: any, i: number) => (
                    <div
                      key={lesson._id || i}
                      className="p-2.5 rounded-lg bg-black/60 border border-[#7efeff]/20 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#7efeff] shrink-0" />
                        <span className="text-white font-bold truncate max-w-[200px]">
                          {typeof lesson === 'string' ? lesson : lesson.title || 'Lesson Capsule'}
                        </span>
                      </div>
                      {typeof lesson === 'object' && lesson.category && (
                        <Badge variant="cyan" size="sm">
                          {lesson.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        ) : (
          <GlassCard glow="emerald" className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-mono font-bold text-white text-sm flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles size={16} className="text-[#00ff99]" />
                  MISSION READINESS: STANDBY
                </div>
                <p className="text-xs font-mono text-slate-400">
                  You have not completed any practice labs yet. Jump into an interactive simulation to build your OSINT skill log.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/tool-explorer')}
                  className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 font-mono text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass size={13} />
                  EXPLORE TOOLS
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/practice-labs')}
                  className="px-4 py-2 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99] font-mono text-xs font-bold hover:bg-[#00ff99]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FlaskConical size={13} />
                  START LAB
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default Profile;
