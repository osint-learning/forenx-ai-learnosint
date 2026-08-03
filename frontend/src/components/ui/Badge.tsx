import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'warning' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  className = ''
}) => {
  const styles = {
    emerald: 'bg-[#00ff99]/15 text-[#00ff99] border-[#00ff99]/40',
    cyan: 'bg-[#7efeff]/15 text-[#7efeff] border-[#7efeff]/40',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/40'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
  <span
    className={`
      inline-flex items-center font-mono font-medium rounded-md border backdrop-blur-md uppercase tracking-wider
      ${styles[variant]}
      ${sizes[size]}
      ${className ?? ""}
    `}
  >
      {children}
    </span>
  );
};
export default Badge;