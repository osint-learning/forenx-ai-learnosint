import React, { useState, useMemo } from 'react';
import { User, Mail, Lock, Shield, Eye, EyeOff, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import { useAuth } from "../../context/AuthContext";

interface RegisterFormProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

type StrengthLevel = {
  score: number;
  label: string;
  color: string;
  glow: string;
};

export function RegisterForm({ onSuccess, onNavigateToLogin }: RegisterFormProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation / UI State
  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();
  // Dynamic Password Strength Calculation (UI-only)
  const passwordStrength = useMemo<StrengthLevel>(() => {
    if (!password) return { score: 0, label: 'NO ENTRIES', color: 'bg-white/10', glow: 'shadow-none' };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'COMPROMISED / WEAK', color: 'bg-red-500', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)] text-red-400' };
      case 2:
        return { score: 2, label: 'VULNERABLE', color: 'bg-orange-500', glow: 'shadow-[0_0_8px_rgba(249,115,22,0.5)] text-orange-400' };
      case 3:
        return { score: 3, label: 'STANDARD STRENGTH', color: 'bg-yellow-400', glow: 'shadow-[0_0_8px_rgba(250,204,21,0.5)] text-yellow-300' };
      case 4:
        return { score: 4, label: 'CYBER SHIELD ACTIVE', color: 'bg-[#7efeff]', glow: 'shadow-[0_0_8px_rgba(126,254,255,0.5)] text-[#7efeff]' };
      case 5:
        return { score: 5, label: 'MILITARY SHIELD SECURE', color: 'bg-[#00ff99]', glow: 'shadow-[0_0_8px_rgba(0,255,153,0.5)] text-[#00ff99]' };
      default:
        return { score: 0, label: 'NO ENTRIES', color: 'bg-white/10', glow: 'shadow-none' };
    }
  }, [password]);

  // Form Validation
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'ACCESS DENIED: Operator name required.';
    }

    if (!username.trim()) {
      newErrors.username = 'ACCESS DENIED: Handle/Username required.';
    } else if (username.length < 3) {
      newErrors.username = 'ACCESS DENIED: Handle must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'ACCESS DENIED: Handle can only contain alphanumeric characters and underscores.';
    }

    if (!email) {
      newErrors.email = 'ACCESS DENIED: Email address required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'ACCESS DENIED: Invalid email signature.';
    }

    if (!password) {
      newErrors.password = 'ACCESS DENIED: Access token (password) required.';
    } else if (password.length < 6) {
      newErrors.password = 'ACCESS DENIED: Access token too short (min 6 chars).';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'ACCESS DENIED: Token confirmation required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'ACCESS DENIED: Session tokens do not match.';
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'ACCESS DENIED: You must accept system usage protocols.';
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
        await register(fullName, email, password);

        setIsSuccess(true);

        setTimeout(() => {
        onSuccess?.();
        }, 1000);

    } catch (err: any) {
        setErrors({
        email:
            err?.response?.data?.message ||
            "Registration failed.",
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
            <h3 className="text-xl font-mono text-[#00ff99] tracking-wider uppercase">Profile Deployed</h3>
            <p className="text-sm font-mono text-white/60">Operator account established. Granting node credentials...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              Operator Full Name
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Agent John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-black/40 border ${
                  errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff]'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#7efeff]/20`}
              />
            </div>
            {errors.fullName && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              OSINT Handle (Username)
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <Shield className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="operator_omega"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-black/40 border ${
                  errors.username ? 'border-red-500 focus:border-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff]'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#7efeff]/20`}
              />
            </div>
            {errors.username && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              Secure Email Address
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="operator@forenxai.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 bg-black/40 border ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff]'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#7efeff]/20`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              Session Access Token
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-11 py-2.5 bg-black/40 border ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff]'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#7efeff]/20`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00ff99] transition-colors duration-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator (UI-only) */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase">Entropy Rating:</span>
                  <span className={`font-bold uppercase tracking-wider ${passwordStrength.glow}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        passwordStrength.score >= lvl ? passwordStrength.color : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-[#7efeff] uppercase tracking-widest font-bold">
              Verify Access Token
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#00ff99] transition-colors duration-300">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-11 pr-11 py-2.5 bg-black/40 border ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[#00ff99]/20 focus:border-[#7efeff]'
                } rounded-lg text-white font-mono placeholder-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#7efeff]/20`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00ff99] transition-colors duration-300 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Accept Terms */}
          <div className="space-y-1.5">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group text-xs font-mono text-white/60 hover:text-white transition-colors duration-300">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                  acceptTerms 
                    ? 'border-[#7efeff] bg-[#7efeff]/10 text-[#7efeff] shadow-[0_0_8px_rgba(126,254,255,0.3)]' 
                    : 'border-white/20 bg-black/40 group-hover:border-[#7efeff]/50'
                }`}>
                  {acceptTerms && (
                    <div className="w-2 h-2 bg-[#7efeff] rounded-sm" />
                  )}
                </div>
              </div>
              <span>
                I agree to the <span className="text-[#7efeff] hover:text-[#00ff99] underline">System Access Protocols</span> and ethical OSINT conduct guidelines.
              </span>
            </label>
            {errors.acceptTerms && (
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.acceptTerms}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <GlowButton
              type="submit"
              variant="cyan"
              isLoading={isLoading}
              className="w-full uppercase tracking-wider py-3"
            >
              Deploy Profile / Initialize Node
            </GlowButton>
          </div>

          {/* Redirect to Login */}
          <div className="text-center pt-2 border-t border-white/5">
            <span className="text-xs font-mono text-white/50">
              Session credentials exist?{' '}
            </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs font-mono text-[#00ff99] hover:text-[#7efeff] underline underline-offset-4 font-bold transition-colors duration-300"
            >
              Login Operator
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;
