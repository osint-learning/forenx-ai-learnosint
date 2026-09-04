import React from "react";
import { Terminal, Shield, Info } from "lucide-react";
import { InteractiveTerminal } from "../components/terminal/InteractiveTerminal";

export const IndependentTerminal: React.FC = () => {

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">

      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff99]/30 bg-[#00ff99]/5 text-[#00ff99] text-xs font-mono font-bold mb-4">

            <Terminal size={14} />

            INDEPENDENT OSINT TERMINAL

          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-bold">

            OSINT
            <span className="text-[#00ff99]">
              {" "}COMMAND TERMINAL
            </span>

          </h1>

          <p className="text-slate-400 font-mono text-sm mt-3 max-w-3xl">

            Explore and practice OSINT reconnaissance commands
            independently using the ForenX command environment.

          </p>

        </div>


        {/* INFORMATION CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="rounded-xl border border-[#00ff99]/20 bg-[#03150e]/70 p-4">

            <div className="flex items-center gap-2 text-[#00ff99] mb-2">

              <Terminal size={17} />

              <span className="font-mono text-xs font-bold">
                FREE PRACTICE
              </span>

            </div>

            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              Run supported OSINT commands without a
              predefined mission or lab objective.
            </p>

          </div>


          <div className="rounded-xl border border-[#00ff99]/20 bg-[#03150e]/70 p-4">

            <div className="flex items-center gap-2 text-[#00ff99] mb-2">

              <Shield size={17} />

              <span className="font-mono text-xs font-bold">
                CONTROLLED ENVIRONMENT
              </span>

            </div>

            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              Commands are validated by the ForenX backend
              before reconnaissance is executed.
            </p>

          </div>


          <div className="rounded-xl border border-[#00ff99]/20 bg-[#03150e]/70 p-4">

            <div className="flex items-center gap-2 text-[#00ff99] mb-2">

              <Info size={17} />

              <span className="font-mono text-xs font-bold">
                SUPPORTED COMMANDS
              </span>

            </div>

            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              Use help inside the terminal to view the
              currently available OSINT commands.
            </p>

          </div>

        </div>


        {/* TERMINAL */}

        <div className="h-[650px]">

          <InteractiveTerminal
            initialTarget="example.com"
          />

        </div>

      </div>

    </div>
  );
};

export default IndependentTerminal;