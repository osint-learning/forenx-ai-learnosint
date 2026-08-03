import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'green' | 'cyan' | 'primary' | 'ghost';
  glow?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function GlowButton({
  children,
  className = '',
  variant = 'green',
  glow = true,
  isLoading = false,
  icon,
  ...props
}: GlowButtonProps) {
  const baseStyles = 'relative font-mono tracking-wider font-semibold rounded-lg px-6 py-2.5 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2 border';
  
  const variantStyles = {
    green:
      'bg-transparent text-[#00ff99] border-[#00ff99]/50 hover:bg-[#00ff99] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,153,0.4)]',

    cyan:
      'bg-transparent text-[#7efeff] border-[#7efeff]/50 hover:bg-[#7efeff] hover:text-black hover:shadow-[0_0_20px_rgba(126,254,255,0.4)]',

    primary:
      'bg-transparent text-[#00ff99] border-[#00ff99]/50 hover:bg-[#00ff99] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,153,0.4)]',

    ghost:
      'bg-transparent text-slate-300 border border-white/10 hover:text-[#00ff99] hover:bg-white/5'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          <span>PROCESSING...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default GlowButton;
