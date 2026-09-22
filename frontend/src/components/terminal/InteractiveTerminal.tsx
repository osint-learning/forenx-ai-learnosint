import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RefreshCw,
  HelpCircle
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
  initialCommand?: string;
  onCommandRun?: (
    cmd: string,
    response?: any
  ) => void;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  initialTarget = 'example.com',
  practiceTool,
  labId,
  initialCommand,
  onCommandRun
}) => {
  // Compute dynamic initial command based on props for placeholder and hint
  const defaultCommand = useMemo(() => {
    if (initialCommand && initialCommand.trim()) {
      return initialCommand.trim();
    }
    if (practiceTool && practiceTool.trim()) {
      const toolBase = practiceTool.trim().toLowerCase().split(' ')[0];
      const target = initialTarget ? ` ${initialTarget.trim()}` : '';
      return `${toolBase}${target}`.trim();
    }
    return `whois ${initialTarget || 'example.com'}`;
  }, [initialCommand, practiceTool, initialTarget]);

  const [history, setHistory] = useState<CommandOutput[]>(() => [
    {
      command: 'sysinfo',
      output: `ForenX AI OSINT Practice Terminal\nEnvironment: ${practiceTool ? `${practiceTool.toUpperCase()} Practice Lab` : 'Independent Reconnaissance'}\nTarget: ${initialTarget || 'example.com'}\nType "help" to view available commands.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'standard'
    }
  ]);

  // Requirement 1: Input MUST initially be empty (never pre-typed)
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear input whenever lab or defaultCommand changes
  useEffect(() => {
    setCurrentInput('');
  }, [defaultCommand]);

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
    // LOCAL COMMAND: SYSINFO
    // ------------------------------------------------
    if (cmd.toLowerCase() === 'sysinfo') {
      const sysinfoOutput = `ForenX AI OSINT Practice Terminal\nEnvironment: ${practiceTool ? `${practiceTool.toUpperCase()} Practice Lab` : 'Independent Reconnaissance'}\nTarget: ${initialTarget || 'example.com'}\nType "help" to view available commands.`;
      setHistory(prev => [
        ...prev,
        {
          command: cmd,
          output: sysinfoOutput,
          timestamp: timeStr,
          type: 'standard'
        }
      ]);
      setCurrentInput('');
      return;
    }

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
      const helpOutput = practiceTool
        ? `AVAILABLE COMMAND FOR THIS PRACTICE LAB

  ${defaultCommand}  - Recommended command for ${practiceTool}

UTILITY COMMANDS
  help                  - Show available commands for this lab
  clear                 - Clear terminal output

ACTIVE PRACTICE CONTEXT
  Target:  ${initialTarget || 'example.com'}
  Tool:    ${practiceTool}
  Command: ${defaultCommand}`
        : `AVAILABLE COMMANDS

[DNS & DOMAIN RECONNAISSANCE]
  dig <domain> [options]         - Low-level DNS query & interrogation (Docker)
  host <domain>                  - DNS lookup & host resolution (Docker)
  dnsrecon -d <domain>           - DNS enumeration & zone transfer (Docker)
  dnsenum <domain>               - Comprehensive DNS enumeration (Docker)
  fierce --domain <domain>       - DNS reconnaissance scanner (Docker)
  dns <domain>                   - Core DNS records lookup (Service)
  nslookup <domain>              - Name server lookup utility (CLI)
  dnsdumpster <domain>           - Passive DNS asset discovery (Service)

[SUBDOMAIN & INFRASTRUCTURE ENUMERATION]
  subfinder -d <domain> [flags]  - Passive subdomain discovery (Docker)
  assetfinder <domain>           - Subdomain & asset discovery (Docker)
  amass enum -d <domain>         - In-depth attack surface discovery (Docker)
  securitytrails <domain>        - Historical DNS & IP data (API)
  crtsh <domain>                 - Certificate Transparency log search (Service)
  censys <target>                - Internet infrastructure search (API)
  shodan <target>                - Internet-connected device intelligence (API)

[IDENTITY & PEOPLE OSINT]
  sherlock <username>            - Social media account discovery (Docker)
  maigret <username>             - Extensive username dossier search (Docker)
  whatsmyname <username>         - Account enumeration across platforms (Service)
  theharvester -d <domain> -b <src> - Email, subdomain & name harvester (Docker)
  holehe <email>                 - Email password recovery account finder (Docker)
  hunter <domain>                - Email format & address finder (API)
  phoneinfoga scan -n <phone>    - International phone number OSINT (Docker)
  hibp <email>                   - Data breach & credential exposure check (API)

[WEB PROFILE, METADATA & THREAT INTELLIGENCE]
  whatweb <url>                  - Web technology profiling scanner (Docker)
  wappalyzer <url>               - Web application framework detector (Service)
  exiftool <file/url>            - File and image metadata extraction (Docker)
  website <domain>               - Web server & response inspection (Service)
  headers <domain>               - HTTP security header analyzer (Service)
  ssl <domain>                   - SSL/TLS certificate inspector (Service)
  robots <domain>                - robots.txt discovery & parser (Service)
  technology <domain>            - Tech stack identifier (Service)
  metadata <url>                 - Metadata extractor (Service)
  urlscan <url>                  - Automated URL and page scanner (API)
  virustotal <domain>            - Multi-engine malware & threat analysis (API)
  wayback <domain>               - Internet Archive historical snapshots (Service)

[NETWORK SCANNING]
  nmap [options] <target>        - Network scanner & port explorer (Docker)
  recon <domain>                 - Comprehensive automated reconnaissance
  fullscan <domain>              - Full multi-engine reconnaissance scan

[SEARCH ENGINE & DORKING DISCOVERY]
  google <query>                 - Google web search (Service)
  bing <query>                   - Microsoft Bing web search (Service)
  duckduckgo <query>             - Privacy-focused search (Service)
  yandex <query>                 - Yandex international search (Service)
  brave <query>                  - Brave independent search (Service)
  mojeek <query>                 - Mojeek independent search (Service)
  dork <query>                   - Google Dorking search (Service)
  lens <url>                     - Visual reverse image search (Service)

[SYSTEM UTILITIES]
  clear                          - Clear terminal output
  help                           - Show this command reference`;

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
        output: `Executing reconnaissance command [${cmd}]...`,
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
      const response = await OsintService.executeTerminalCommand(
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
      const output = response?.data
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

  // Explicit user action to prefill the default lab command
  const handleInsertDefaultCommand = () => {
    setCurrentInput(defaultCommand);
    inputRef.current?.focus();
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
            {practiceTool && (
              <span className="text-[10px] text-slate-400 font-normal">
                [{practiceTool}]
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleInsertDefaultCommand}
            title="Insert default lab command into input"
            className="text-[11px] font-mono text-slate-400 hover:text-[#00ff99] flex items-center gap-1 transition-colors cursor-pointer"
            disabled={isExecuting}
          >
            <HelpCircle size={12} />
            Default Cmd
          </button>

          <button
            type="button"
            onClick={() => setHistory([])}
            className="text-xs font-mono text-slate-400 hover:text-[#00ff99] flex items-center gap-1 transition-colors cursor-pointer"
            disabled={isExecuting}
          >
            <RefreshCw size={12} />
            Clear
          </button>
        </div>
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
              className={`p-2.5 rounded bg-white/5 border whitespace-pre-wrap leading-relaxed ${
                item.type === 'success'
                  ? 'text-[#17ff88] border-[#00ff99]/20'
                  : item.type === 'error'
                  ? 'text-rose-400 border-rose-500/20'
                  : 'text-slate-300 border-white/5'
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
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          disabled={isExecuting}
          placeholder={`Try: ${defaultCommand}`}
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none"
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

export default InteractiveTerminal;
