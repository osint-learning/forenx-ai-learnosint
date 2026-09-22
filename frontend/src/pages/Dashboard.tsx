import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { IntelligenceCore } from '../components/intelligence/IntelligenceCore';
import { OrbitSystem } from '../components/intelligence/OrbitSystem';
import { Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tools } = useApp();

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

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
    </div>
  );
};

export default Dashboard;
