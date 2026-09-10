import React from 'react';

import { useApp } from '../context/AppContext';

import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';

import {
  User,
  Award,
  Shield,
  BookOpen,
  FlaskConical,
  Mail,
  Calendar,
  Activity,
} from 'lucide-react';


export const Profile: React.FC = () => {

  const {
    userProfile,
  } = useApp();


  // =========================================================
  // REAL USER DATA
  // =========================================================

  const currentXp =
    userProfile.currentXp || 0;

  const level =
    userProfile.level || 1;

  const nextLevelXp =
    level * 5000;

  const xpProgress =
    Math.min(
      Math.round(
        (currentXp / nextLevelXp) * 100
      ),
      100
    );


  const completedLabs =
    userProfile.completedLabsCount || 0;

  const completedLessons =
    userProfile.completedLessonsCount || 0;

  const badges =
    userProfile.badges || [];


  // =========================================================
  // ACCOUNT CREATION DATE
  // =========================================================

  const formattedCreatedAt =
    userProfile.createdAt
      ? new Date(
          userProfile.createdAt
        ).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )
      : 'Not available';


  // =========================================================
  // ROLE / RANK DISPLAY
  // =========================================================

  const displayRole =
    userProfile.role
      ? userProfile.role.toUpperCase()
      : 'STUDENT';


  const rank =
    level >= 10
      ? 'ELITE INVESTIGATOR'
      : level >= 5
        ? 'ADVANCED ANALYST'
        : 'BEGINNER ANALYST';


  return (

    <div className="space-y-8">


      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <GlassCard
        glow="emerald"
        className="p-8"
      >

        <div className="flex flex-col md:flex-row items-center gap-6">


          {/* AVATAR */}

          <div className="p-4 rounded-2xl bg-[#00ff99]/20 border border-[#00ff99] text-[#00ff99] shadow-[0_0_30px_rgba(0,255,153,0.4)]">

            <User size={48} />

          </div>


          {/* USER INFORMATION */}

          <div className="space-y-3 text-center md:text-left flex-1">

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">

              <h1 className="text-3xl font-mono font-bold text-white tracking-wider">

                {userProfile.username || 'Loading...'}

              </h1>


              <Badge variant="emerald">

                LVL {level}

              </Badge>


              <Badge variant="cyan">

                {rank}

              </Badge>

            </div>


            <p className="text-xs font-mono text-slate-400">

              Account Type:{' '}

              <span className="text-[#00ff99] font-bold">

                {displayRole}

              </span>

            </p>


            <p className="text-xs font-mono text-slate-400">

              Agent Status:{' '}

              <span className="text-[#00ff99] font-bold">

                ACTIVE

              </span>

            </p>

          </div>


          {/* XP */}

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">


            <ProgressRing
              progress={xpProgress}
              size={70}
              color="#00ff99"
            />


            <div className="font-mono">

              <div className="text-lg font-bold text-white">

                {currentXp} XP

              </div>


              <div className="text-xs text-slate-400">

                Next Level: {nextLevelXp} XP

              </div>

            </div>

          </div>

        </div>

      </GlassCard>



      {/* =====================================================
          ACCOUNT INFORMATION
      ====================================================== */}

      <div className="space-y-4">

        <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">

          <Shield
            className="text-[#00ff99]"
            size={22}
          />

          ACCOUNT INFORMATION

        </h3>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* EMAIL */}

          <GlassCard
            glow="cyan"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <Mail
                className="text-[#7efeff]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  EMAIL

                </p>

                <p className="text-sm text-white font-mono break-all">

                  {userProfile.email || 'Not available'}

                </p>

              </div>

            </div>

          </GlassCard>



          {/* ROLE */}

          <GlassCard
            glow="emerald"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <Shield
                className="text-[#00ff99]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  ACCOUNT ROLE

                </p>

                <p className="text-xl text-white font-mono font-bold">

                  {displayRole}

                </p>

              </div>

            </div>

          </GlassCard>



          {/* CREATED DATE */}

          <GlassCard
            glow="cyan"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <Calendar
                className="text-[#7efeff]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  MEMBER SINCE

                </p>

                <p className="text-sm text-white font-mono">

                  {formattedCreatedAt}

                </p>

              </div>

            </div>

          </GlassCard>

        </div>

      </div>



      {/* =====================================================
          LEARNING / INVESTIGATION PROGRESS
      ====================================================== */}

      <div className="space-y-4">

        <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">

          <Activity
            className="text-[#00ff99]"
            size={22}
          />

          INVESTIGATION PROGRESS

        </h3>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          {/* XP */}

          <GlassCard
            glow="emerald"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <Activity
                className="text-[#00ff99]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  EXPERIENCE

                </p>

                <p className="text-2xl text-white font-mono font-bold">

                  {currentXp} XP

                </p>

              </div>

            </div>

          </GlassCard>



          {/* LESSONS */}

          <GlassCard
            glow="cyan"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <BookOpen
                className="text-[#7efeff]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  LESSONS COMPLETED

                </p>

                <p className="text-2xl text-white font-mono font-bold">

                  {completedLessons}

                </p>

              </div>

            </div>

          </GlassCard>



          {/* LABS */}

          <GlassCard
            glow="cyan"
            className="p-5"
          >

            <div className="flex items-center gap-3">

              <FlaskConical
                className="text-[#7efeff]"
                size={22}
              />

              <div>

                <p className="text-xs text-slate-500 font-mono">

                  LABS COMPLETED

                </p>

                <p className="text-2xl text-white font-mono font-bold">

                  {completedLabs}

                </p>

              </div>

            </div>

          </GlassCard>

        </div>

      </div>



      {/* =====================================================
          BADGES
      ====================================================== */}

      <div className="space-y-4">

        <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">

          <Award
            className="text-[#00ff99]"
            size={22}
          />

          UNLOCKED BADGES & CERTIFICATIONS

        </h3>


        {badges.length === 0 ? (

          <GlassCard
            glow="cyan"
            className="p-8"
          >

            <div className="text-center space-y-3">

              <Award
                className="mx-auto text-slate-600"
                size={42}
              />

              <h4 className="font-mono font-bold text-white">

                NO BADGES UNLOCKED

              </h4>

              <p className="text-xs font-mono text-slate-400">

                Complete lessons, practice labs, and investigation
                missions to unlock badges.

              </p>

            </div>

          </GlassCard>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {badges.map(
              (badge, index) => (

                <GlassCard
                  key={`${badge}-${index}`}
                  glow="cyan"
                  className="p-5 space-y-3"
                >

                  <div className="p-3 rounded-xl bg-[#7efeff]/15 text-[#7efeff] border border-[#7efeff]/40 w-fit">

                    <Award size={24} />

                  </div>


                  <h4 className="font-mono font-bold text-white text-sm">

                    {badge}

                  </h4>


                  <p className="text-xs font-mono text-slate-400 leading-relaxed">

                    Achievement unlocked through
                    ForenX AI LearnOSINT.

                  </p>

                </GlassCard>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};