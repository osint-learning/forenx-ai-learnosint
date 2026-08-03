import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { GlowButton } from '../ui/GlowButton';
import {
  Shield,
  Search,
  Bot,
  Zap,
  LogOut,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { userProfile, setIsAiMentorOpen, isAiMentorOpen, setSelectedTool, tools } = useApp();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Learn', path: '/learn' },
    { label: 'Tool Explorer', path: '/tool-explorer' },
    { label: 'Recon Engine', path: '/recon' },
    { label: 'Practice Labs', path: '/practice-labs' },
    { label: 'Investigations', path: '/investigations' },
    { label: 'Reports', path: '/reports' },
    { label: 'Profile', path: '/profile' }
  ];

  const filteredTools = searchQuery.trim()
    ? tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="liquid-glass rounded-2xl p-3 px-6 flex items-center justify-between gap-4 border border-[#00ff99]/30 shadow-[0_0_30px_rgba(0,255,153,0.15)]">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-[#00ff99]/15 border border-[#00ff99]/40 text-[#00ff99] group-hover:shadow-[0_0_20px_rgba(0,255,153,0.6)] transition-all">
            <Shield size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-lg text-white tracking-widest">FOREN</span>
              <span className="font-mono font-black text-lg text-[#00ff99] tracking-widest">X</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40">AI</span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">LEARNOSINT // COMMAND CENTER</p>
          </div>
        </NavLink>

        {/* Links Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/50 shadow-[0_0_12px_rgba(0,255,153,0.3)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search OSINT tools..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-44 focus:w-60 bg-black/60 border border-[#00ff99]/20 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#00ff99] transition-all font-mono"
              />
            </div>

            {/* Quick Search Dropdown */}
            {showSearchDropdown && filteredTools.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-[#030303]/95 border border-[#00ff99]/40 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      navigate('/tool-explorer');
                    }}
                    className="p-2 rounded-lg hover:bg-[#00ff99]/20 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-mono font-bold text-white">{tool.name}</span>
                    <span className="text-[10px] font-mono text-[#7efeff]">{tool.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/30 text-xs font-mono text-[#00ff99]">
            <Zap size={14} className="animate-pulse" />
            <span>{userProfile.currentXp} XP</span>
          </div>

          {/* AI Mentor Toggle */}
          <GlowButton
            variant={isAiMentorOpen ? "primary" : "secondary"}
            icon={<Bot size={16} />}
            onClick={() => setIsAiMentorOpen(!isAiMentorOpen)}
            className="!px-3 !py-1.5"
          >
            <span className="hidden sm:inline">
              AI Mentor
            </span>
          </GlowButton>

          {/* Logout Button */}
          <GlowButton
            variant="secondary"
            icon={<LogOut size={16} />}
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logout();
                navigate("/login", { replace: true });
              }
            }}
            className="!px-3 !py-1.5"
          >
            <span className="hidden sm:inline">
              Logout
            </span>
          </GlowButton>
        </div>
      </div>
    </header>
  );
};
