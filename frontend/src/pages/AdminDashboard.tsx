import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OsintService } from '../services/api';
import type { AdminOverview as AdminOverviewType } from '../types';

import { AdminSidebar } from '../components/admin/AdminSidebar';
import type { AdminTab } from '../components/admin/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { StudentManagement } from '../components/admin/StudentManagement';
import { ToolManagement } from '../components/admin/ToolManagement';
import { LessonManagement } from '../components/admin/LessonManagement';
import { QuizManagement } from '../components/admin/QuizManagement';
import { LabManagement } from '../components/admin/LabManagement';
import { AnalyticsPanel } from '../components/admin/AnalyticsPanel';
import { ReportsPanel } from '../components/admin/ReportsPanel';

import { Menu, Shield, Activity, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getAdminOverview();
      setOverview(data);
    } catch (err: any) {
      console.error('Admin overview error:', err);
      setError(err?.response?.data?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="min-h-screen bg-[#030504] text-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 bg-[#060807]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#00ff99]/15 border border-[#00ff99]/40 text-[#00ff99]">
                <Shield size={18} />
              </div>
              <div>
                <span className="font-mono font-black text-sm text-white tracking-widest">FOREN</span>
                <span className="font-mono font-black text-sm text-[#00ff99] tracking-widest">X // ADMIN CONTROL</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <button onClick={loadOverview} title="Refresh Data" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-[#00ff99] border border-white/10 transition-colors cursor-pointer">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/30 text-[#00ff99]">
              <Activity size={13} className="animate-pulse" />
              <span>ADMIN AUTH: AUTHORIZED</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex gap-6 relative">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main className="flex-1 min-w-0">
          {loading && !overview ? (
            <div className="p-24 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin" />
              <span>SYNCHRONIZING ADMIN CONTROL CENTER...</span>
            </div>
          ) : error ? (
            <div className="p-8 rounded-xl border border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-300">{error}</div>
          ) : (
            <>
              {activeTab === 'overview' && <AdminOverview overview={overview} onNavigateTab={setActiveTab} />}
              {activeTab === 'students' && <StudentManagement />}
              {activeTab === 'tools' && <ToolManagement />}
              {activeTab === 'lessons' && <LessonManagement />}
              {activeTab === 'quizzes' && <QuizManagement />}
              {activeTab === 'labs' && <LabManagement />}
              {activeTab === 'analytics' && <AnalyticsPanel />}
              {activeTab === 'reports' && <ReportsPanel overview={overview} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;