import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-[#00ff99]/15 text-[#00ff99] border border-[#00ff99]/60 hover:bg-[#00ff99]/25 hover:shadow-[0_0_20px_rgba(0,255,153,0.5)] hover:border-[#17ff88]',
    secondary: 'bg-[#7efeff]/10 text-[#7efeff] border border-[#7efeff]/40 hover:bg-[#7efeff]/20 hover:shadow-[0_0_20px_rgba(126,254,255,0.4)]',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/40 hover:bg-rose-500/25 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    ghost: 'bg-transparent text-slate-300 hover:text-[#00ff99] hover:bg-white/5 border border-white/10'
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
