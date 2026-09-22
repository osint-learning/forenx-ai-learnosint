import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Wrench,
  BookOpen,
  HelpCircle,
  FlaskConical,
  BarChart3,
  FileText,
  LogOut,
  Shield,
  Activity
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'students'
  | 'tools'
  | 'lessons'
  | 'quizzes'
  | 'labs'
  | 'analytics'
  | 'reports';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen = false,
  setIsMobileOpen
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'students' as AdminTab, label: 'Students', icon: <Users size={18} /> },
    { id: 'tools' as AdminTab, label: 'Tools', icon: <Wrench size={18} /> },
    { id: 'lessons' as AdminTab, label: 'Lessons', icon: <BookOpen size={18} /> },
    { id: 'quizzes' as AdminTab, label: 'Quizzes', icon: <HelpCircle size={18} /> },
    { id: 'labs' as AdminTab, label: 'Practice Labs', icon: <FlaskConical size={18} /> },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'reports' as AdminTab, label: 'Reports', icon: <FileText size={18} /> },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed lg:sticky top-4 left-0 h-[calc(100vh-2rem)] w-64 shrink-0 z-30 transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="h-full flex flex-col justify-between rounded-2xl border border-[#00ff99]/30 bg-[#060807]/90 backdrop-blur-xl p-4 shadow-[0_0_30px_rgba(0,255,153,0.08)]">
        
        {/* Top Header & Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="p-2 rounded-lg bg-[#00ff99]/15 border border-[#00ff99]/40 text-[#00ff99]">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-mono font-black text-sm text-white tracking-widest">FOREN</span>
                <span className="font-mono font-black text-sm text-[#00ff99] tracking-widest">X</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/30">ADMIN</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">CONTROL CENTER</p>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#00ff99]/5 border border-[#00ff99]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff99] animate-pulse" />
              <span className="text-[11px] font-mono text-[#00ff99] font-medium tracking-wider">SYSTEM: ONLINE</span>
            </div>
            <Activity size={13} className="text-[#00ff99]/70" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left
                    ${isActive
                      ? 'bg-[#00ff99]/15 text-[#00ff99] border border-[#00ff99]/40 font-bold shadow-[0_0_15px_rgba(0,255,153,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}
                  `}
                >
                  <span className={isActive ? 'text-[#00ff99]' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 truncate">
            OP: <span className="text-slate-300 font-semibold">{user?.fullName || 'Administrator'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-rose-500/20 bg-rose-500/5 text-xs font-mono text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
