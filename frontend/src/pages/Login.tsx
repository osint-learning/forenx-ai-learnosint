import { useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useEffect } from "react";

import GlassCard from "../components/ui/GlassCard";
import LoginForm from "../components/auth/LoginForm";
import Badge from "../components/ui/Badge";

import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Already logged in?
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#00ff99]/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#7efeff]/5 rounded-full blur-[80px]" />

      <div className="w-full max-w-[450px] z-10">

        <div className="flex items-center justify-between mb-4 px-2 font-mono text-[10px] text-white/40 tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-ping" />
            <span>PORTAL: SECURE_ON</span>
          </div>

          <span>SYSTEM: ONLINE</span>
        </div>

        <GlassCard
        className="relative p-8 overflow-hidden border border-[#00ff99]/20"
        glow="emerald"
        >

          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00ff99]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00ff99]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00ff99]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00ff99]" />

          <div className="flex flex-col items-center text-center mb-8">

            <div className="relative mb-3 flex items-center justify-center p-3 bg-black/60 rounded-xl border border-[#00ff99]/20">

              <svg
                className="w-10 h-10 text-[#00ff99]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>

            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                FORENX
              </span>

              <span className="text-lg font-bold text-[#00ff99]">
                AI
              </span>

              <Badge variant="cyan">
                OSINT
              </Badge>
            </div>

            <h1 className="text-2xl font-bold mt-4">
              Welcome Back
            </h1>

            <p className="text-sm text-white/60 mt-2">
              Sign in to continue your OSINT learning journey.
            </p>

          </div>

          <LoginForm
            onSuccess={handleSuccess}
            onNavigateToRegister={handleNavigateToRegister}
          />

          <div className="mt-6 flex justify-between items-center text-[10px] text-white/30 border-t border-white/10 pt-4">

            <span className="flex items-center gap-1">
              <Terminal size={12} />
              SECURE_HANDSHAKE_NODE
            </span>

            <span>OS_VER_1.4.0</span>

          </div>

        </GlassCard>

      </div>

    </div>
  );
}

export default Login;