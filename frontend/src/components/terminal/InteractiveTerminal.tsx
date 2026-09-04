import React, { useEffect, useRef, useState } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RefreshCw
} from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { OsintService } from '../../services/api';

interface CommandOutput {
  command: string;
  output: string;
  timestamp: string;
  type?: 'standard' | 'success' | 'error';
}

interface InteractiveTerminalProps {
  initialTarget?: string;
  practiceTool?: string;
  labId?: string;

  onCommandRun?: (
    cmd: string,
    response?: any
  ) => void;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  initialTarget = 'example.com',
  practiceTool,
  labId,
  onCommandRun
}) => {

  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'sysinfo',
      output:
        'ForenX AI OSINT Practice Terminal\nReal reconnaissance environment\nType "help" to view available commands.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'standard'
    }
  ]);

  const [currentInput, setCurrentInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [history]);

  // --------------------------------------------------
  // FORMAT OUTPUT
  // --------------------------------------------------

  const formatOutput = (data: any): string => {

    if (typeof data === 'string') {
      return data;
    }

    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  // --------------------------------------------------
  // HANDLE COMMAND
  // --------------------------------------------------

  const handleCommand = async (e: React.FormEvent) => {

    e.preventDefault();

    const cmd = currentInput.trim();

    if (!cmd || isExecuting) {
      return;
    }

    const timeStr = new Date().toLocaleTimeString();

    // ------------------------------------------------
    // LOCAL COMMAND: CLEAR
    // ------------------------------------------------

    if (cmd.toLowerCase() === 'clear') {

      setHistory([]);
      setCurrentInput('');

      return;
    }

    // ------------------------------------------------
    // LOCAL COMMAND: HELP
    // ------------------------------------------------

    if (cmd.toLowerCase() === 'help') {

      const helpOutput = `AVAILABLE COMMANDS

  dns <domain>          - DNS and domain information
  website <domain>      - Website information
  headers <domain>      - Security header analysis
  ssl <domain>          - SSL certificate analysis
  robots <domain>       - robots.txt analysis
  technology <domain>   - Website technology detection
  metadata <url>        - Metadata analysis
  whois <domain>        - WHOIS information
  recon <domain>        - Complete reconnaissance scan
  fullscan <domain>     - Complete reconnaissance scan
  clear                 - Clear terminal
  help                  - Show available commands

EXAMPLE

  dns ${initialTarget}
  technology ${initialTarget}
  ssl ${initialTarget}
  whois ${initialTarget}
  fullscan ${initialTarget}`;

      setHistory(prev => [
        ...prev,
        {
          command: cmd,
          output: helpOutput,
          timestamp: timeStr,
          type: 'standard'
        }
      ]);

      setCurrentInput('');

      return;
    }

    // ------------------------------------------------
    // SHOW EXECUTION MESSAGE
    // ------------------------------------------------

    setHistory(prev => [
      ...prev,
      {
        command: cmd,
        output: 'Executing reconnaissance command...',
        timestamp: timeStr,
        type: 'standard'
      }
    ]);

    setCurrentInput('');
    setIsExecuting(true);

    // ------------------------------------------------
    // EXECUTE REAL BACKEND COMMAND
    // ------------------------------------------------

    try {

      const response =
        await OsintService.executeTerminalCommand(
          cmd,
          practiceTool,
          labId
        );

      // ------------------------------------------------
      // SEND REAL RESPONSE TO PRACTICE LAB
      // ------------------------------------------------

      onCommandRun?.(
        cmd,
        response
      );

      // ------------------------------------------------
      // DISPLAY REAL OUTPUT
      // ------------------------------------------------

      const output =
        response?.data
          ? formatOutput(response.data)
          : formatOutput(response);

      setHistory(prev => [
        ...prev,
        {
          command: '',
          output,
          timestamp: new Date().toLocaleTimeString(),
          type: 'success'
        }
      ]);

    } catch (error: any) {

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Command execution failed.';

      // Send failed command information too
      onCommandRun?.(
        cmd,
        error?.response?.data || {
          success: false,
          error: message
        }
      );

      setHistory(prev => [
        ...prev,
        {
          command: '',
          output: `[ERROR] ${message}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);

    } finally {

      setIsExecuting(false);

    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="liquid-glass rounded-xl overflow-hidden border border-[#00ff99]/30 shadow-[0_0_30px_rgba(0,255,153,0.2)] flex flex-col h-full min-h-[420px]">

      {/* Terminal Header */}

      <div className="bg-[#052d1d]/80 px-4 py-2.5 border-b border-[#00ff99]/20 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div className="flex gap-1.5">

            <span className="w-3 h-3 rounded-full bg-rose-500/80" />

            <span className="w-3 h-3 rounded-full bg-amber-500/80" />

            <span className="w-3 h-3 rounded-full bg-[#00ff99]/80" />

          </div>

          <span className="text-xs font-mono font-bold text-[#00ff99] ml-2 flex items-center gap-1.5">

            <TerminalIcon size={14} />

            root@forenx-terminal:~

          </span>

        </div>

        <button
          onClick={() => setHistory([])}
          className="text-xs font-mono text-slate-400 hover:text-[#00ff99] flex items-center gap-1 transition-colors cursor-pointer"
          disabled={isExecuting}
        >

          <RefreshCw size={12} />

          Clear

        </button>

      </div>

      {/* Terminal Output */}

      <div className="flex-1 p-4 overflow-y-auto bg-black/90 font-mono text-xs space-y-3">

        {history.map((item, index) => (

          <div
            key={index}
            className="space-y-1"
          >

            {item.command && (

              <div className="flex items-center gap-2 text-slate-400">

                <span className="text-[#00ff99] font-bold">
                  $
                </span>

                <span className="text-white font-bold">
                  {item.command}
                </span>

                <span className="text-[10px] text-slate-600 ml-auto">
                  {item.timestamp}
                </span>

              </div>

            )}

            <pre
              className={`p-2.5 rounded bg-white/5 border border-white/5 whitespace-pre-wrap leading-relaxed ${
                item.type === 'success'
                  ? 'text-[#17ff88] border-[#00ff99]/20'
                  : item.type === 'error'
                  ? 'text-rose-400 border-rose-500/20'
                  : 'text-slate-300'
              }`}
            >
              {item.output}
            </pre>

          </div>

        ))}

        {isExecuting && (

          <div className="text-[#00ff99] animate-pulse">
            Running reconnaissance...
          </div>

        )}

        <div ref={bottomRef} />

      </div>

      {/* Terminal Input */}

      <form
        onSubmit={handleCommand}
        className="bg-black border-t border-[#00ff99]/30 p-3 flex items-center gap-2"
      >

        <span className="text-[#00ff99] font-mono font-bold text-sm">
          $
        </span>

        <input
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          disabled={isExecuting}
          placeholder={`Try: whois ${initialTarget}`}
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
        />

        <GlowButton
          type="submit"
          variant="primary"
          icon={<Play size={12} />}
          className="!py-1 !px-3 !text-xs"
          disabled={isExecuting}
        >
          {isExecuting ? 'Running...' : 'Exec'}
        </GlowButton>

      </form>

    </div>
  );
};