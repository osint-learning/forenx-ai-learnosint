import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  glow?: 'emerald' | 'cyan' | 'neon' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  active = false,
  glow = 'emerald'
}) => {
  const glowClasses = {
    emerald: 'hover:border-[#00ff99]/60 hover:shadow-[0_0_25px_rgba(0,255,153,0.35)]',
    cyan: 'hover:border-[#7efeff]/60 hover:shadow-[0_0_25px_rgba(126,254,255,0.35)]',
    neon: 'hover:border-[#17ff88]/60 hover:shadow-[0_0_25px_rgba(23,255,136,0.35)]',
    none: ''
  };

  return (
    <div
      onClick={onClick}
      className={`
        liquid-glass rounded-xl p-5 relative overflow-hidden transition-all duration-300
        ${active ? 'liquid-glass-active border-[#00ff99]' : 'border-[#00ff99]/20'}
        ${onClick ? 'cursor-pointer' : ''}
        ${glowClasses[glow]}
        ${className}
      `}
    >
      {/* Liquid reflections highlight */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl pointer-events-none" />
      {children}
    </div>
  );
};
