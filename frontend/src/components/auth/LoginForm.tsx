import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../ui/GlowButton';

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

export function LoginForm({ onSuccess, onNavigateToRegister }: LoginFormProps) {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation / UI State
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useAuth();
  // Client-side Validation
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'ACCESS DENIED: Email address required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'ACCESS DENIED: Invalid email signature.';
    }
    
    if (!password) {
      newErrors.password = 'ACCESS DENIED: Credentials token (password) required.';
    } else if (password.length < 6) {
      newErrors.password = 'ACCESS DENIED: Token must be at least 6 characters.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});
    setIsLoading(true);

    try {
        await login(email, password);

        setIsSuccess(true);

        setTimeout(() => {
        onSuccess?.();
        }, 1000);

    } catch (err: any) {

        setErrors({
        general:
            err?.response?.data?.message ||
            "Authentication failed.",
        });

    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="w-full">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-fade-in">
          <div className="p-4 bg-[#00ff99]/10 rounded-full border border-[#00ff99] shadow-[0_0_20px_rgba(0,255,153,0.2)] animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-[#00ff99]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-mono text-[#00ff99] tracking-wider uppercase">Handshake Confirmed</h3>
            <p className="text-sm font-mono text-white/60">Initializing secure session tunnel...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono animate-shake">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 animate-pulse" />
              <div>
                <span className="font-bold uppercase tracking-wider block mb-1">SYSTEM ALERT</span>
                {errors.general}
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              Operator Identifier
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                placeholder="email@forenxai.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-black/40 border ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff] focus:ring-[#7efeff]/20'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:ring-4`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-[#7efeff] uppercase tracking-widest font-bold">
                Credentials Token
              </label>
              <button
                type="button"
                className="text-xs font-mono text-white/40 hover:text-[#7efeff] transition-colors duration-300"
                onClick={() => {}}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-11 py-3 bg-black/40 border ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff] focus:ring-[#7efeff]/20'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:ring-4`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00ff99] transition-colors duration-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none group text-xs font-mono text-white/60 hover:text-white transition-colors duration-300">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                  rememberMe 
                    ? 'border-[#00ff99] bg-[#00ff99]/10 text-[#00ff99] shadow-[0_0_8px_rgba(0,255,153,0.3)]' 
                    : 'border-white/20 bg-black/40 group-hover:border-[#00ff99]/50'
                }`}>
                  {rememberMe && (
                    <div className="w-2 h-2 bg-[#00ff99] rounded-sm" />
                  )}
                </div>
              </div>
              <span>Keep session active (Remember Me)</span>
            </label>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <GlowButton
              type="submit"
              variant="green"
              isLoading={isLoading}
              className="w-full uppercase tracking-wider py-3"
            >
              Sign In / Establish Connection
            </GlowButton>
          </div>

          {/* Register Link Divider */}
          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative px-3 bg-[#030303] text-xs font-mono text-white/30 uppercase tracking-widest">
              Sec_Option
            </span>
          </div>

          {/* Navigation Trigger */}
          <div className="text-center">
            <span className="text-xs font-mono text-white/50">
              Don't have credentials?{' '}
            </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-xs font-mono text-[#7efeff] hover:text-[#00ff99] underline underline-offset-4 font-bold transition-colors duration-300"
            >
              Create Operator Account
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
