import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { RegisterForm } from '../components/auth/RegisterForm';
import Badge from '../components/ui/Badge';

export function Register() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log('Registration handshake complete. Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Visual background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      
      {/* Background cyber glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-[#7efeff]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#00ff99]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main card container */}
      <div className="w-full max-w-[450px] z-10 animate-fade-in relative my-6">
        
        {/* Tech system status indicator */}
        <div className="flex items-center justify-between mb-4 px-2 font-mono text-[10px] text-white/40 tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7efeff] animate-pulse" />
            <span>NODE_ENCRYPTION: AES_256</span>
          </div>
          <div>
            <span>REGISTRATION_OPEN</span>
          </div>
        </div>

        <GlassCard className="relative p-8 overflow-hidden border border-[#7efeff]/20" glow="cyan">
          {/* Cyberpunk corner brackets in secondary cyan */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#7efeff] opacity-70" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#7efeff] opacity-70" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#7efeff] opacity-70" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#7efeff] opacity-70" />

          {/* Logo Placeholder & Branding */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3 flex items-center justify-center p-3 bg-black/60 rounded-xl border border-[#7efeff]/20 shadow-[0_0_15px_rgba(126,254,255,0.1)]">
              {/* Shield/Keyhole SVG */}
              <svg 
                className="w-10 h-10 text-[#7efeff] filter drop-shadow-[0_0_8px_rgba(126,254,255,0.4)] animate-pulse" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff99] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff99]"></span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg font-bold tracking-widest font-mono text-white">FORENX</span>
              <span className="text-lg font-black tracking-widest font-mono text-[#00ff99] shadow-sm">AI</span>
              <Badge variant="emerald" className="ml-1 px-1.5 py-0">OSINT</Badge>
            </div>

            <h1 className="text-2xl font-mono tracking-wide text-white font-semibold mt-2">
              Create Your Account
            </h1>
            <p className="text-xs font-mono text-white/50 mt-1 max-w-[280px]">
              Deploy a new operator profile node in the ForenxAI grid.
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm 
            onSuccess={handleSuccess} 
            onNavigateToLogin={handleNavigateToLogin} 
          />

          {/* Subtext info */}
          <div className="mt-6 flex justify-between items-center text-[9px] font-mono text-white/20 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1"><Terminal className="w-2.5 h-2.5" /> INIT_SECURE_TUNNEL</span>
            <span>OS_VER_1.4.0</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Register;
