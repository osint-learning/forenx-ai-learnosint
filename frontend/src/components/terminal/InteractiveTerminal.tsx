import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';

interface CommandOutput {
  command: string;
  output: string;
  timestamp: string;
  type?: 'standard' | 'success' | 'error';
}

interface InteractiveTerminalProps {
  initialTarget?: string;
  onCommandRun?: (cmd: string) => void;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  initialTarget = 'target-domain.com',
  onCommandRun
}) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'sysinfo',
      output: 'ForenX AI OSINT Command Terminal v4.2 [Session SEC-9941]\nType "help" to list available intelligence modules.',
      timestamp: '19:00:00',
      type: 'standard'
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentInput.trim();
    if (!cmd) return;

    onCommandRun?.(cmd);

    let outputText = '';
    let outputType: 'standard' | 'success' | 'error' = 'standard';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      outputText = `AVAILABLE COMMANDS:
  whois <domain>       - Query domain registrar and name servers
  amass enum -d <dom> - Enumerate subdomains passively & actively
  nmap -F <target>     - Scan top 100 fast network ports
  shodan host <ip>     - Retrieve Shodan host banners & open services
  cat <filename>       - Read local evidence file contents
  ls                   - List files in current mission directory
  clear                - Clear terminal screen buffer`;
    } else if (lower.startsWith('whois')) {
      outputText = `[+] Querying WHOIS Database for ${initialTarget}...
Domain Name: ${initialTarget.toUpperCase()}
Registrar: CYBERSEC-REGISTRAR INC
Creation Date: 2019-04-12T10:00:00Z
Name Server: NS1.FORENX-DNS.NET
Name Server: NS2.FORENX-DNS.NET
Registrant State: REDACTED FOR PRIVACY (GDPR Compliance Active)`;
      outputType = 'success';
    } else if (lower.startsWith('amass')) {
      outputText = `[+] OWASP Amass Enumeration Mode Active...
[DNS] api.${initialTarget} 198.51.100.22
[DNS] dev-api-v2.${initialTarget} 198.51.100.88 [SECRET STAGING]
[DNS] mail.${initialTarget} 198.51.100.5
[+] 3 Subdomains discovered across 14 OSINT data sources.`;
      outputType = 'success';
    } else if (lower.startsWith('nmap')) {
      outputText = `[+] Starting Nmap 7.94 scan against ${initialTarget}...
PORT     STATE SERVICE       VERSION
80/tcp   open  http          nginx/1.18.0
443/tcp  open  ssl/http      nginx/1.18.0
502/tcp  open  modbus-scada  Modbus/TCP SCADA
8080/tcp open  http-proxy    Apache Staging
[+] Nmap done: 1 IP address scanned in 1.42 seconds.`;
      outputType = 'success';
    } else if (lower.startsWith('shodan')) {
      outputText = `[+] Shodan Host Banner Search: 198.51.100.44
City: San Francisco | Org: Cybersec Infrastructure
Open Ports: 80, 443, 502
Vulnerability: CVE-2023-9918 (SCADA Unauthenticated Telemetry Read)`;
      outputType = 'success';
    } else if (lower === 'ls') {
      outputText = `mission_brief.txt  intercepted_headers.txt  evidence_log.raw`;
    } else if (lower.startsWith('cat')) {
      outputText = `[CONTENTS OF EVIDENCE FILE]:
X-Internal-Staging: dev-api-v2.phantom-corp-sec.org
Authorization: Bearer ph_live_998127391823`;
      outputType = 'success';
    } else if (lower === 'clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    } else {
      outputText = `Command not recognized: "${cmd}". Type "help" for a list of commands.`;
      outputType = 'error';
    }

    setHistory(prev => [
      ...prev,
      { command: cmd, output: outputText, timestamp: timeStr, type: outputType }
    ]);
    setCurrentInput('');
  };

  return (
    <div className="liquid-glass rounded-xl overflow-hidden border border-[#00ff99]/30 shadow-[0_0_30px_rgba(0,255,153,0.2)] flex flex-col h-full min-h-[420px]">
      {/* Terminal Bar Header */}
      <div className="bg-[#052d1d]/80 px-4 py-2.5 border-b border-[#00ff99]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-[#00ff99]/80" />
          </div>
          <span className="text-xs font-mono font-bold text-[#00ff99] ml-2 flex items-center gap-1.5">
            <TerminalIcon size={14} /> root@forenx-terminal:~
          </span>
        </div>
        <button
          onClick={() => setHistory([])}
          className="text-xs font-mono text-slate-400 hover:text-[#00ff99] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw size={12} /> Clear
        </button>
      </div>

      {/* Terminal Output Log */}
      <div className="flex-1 p-4 overflow-y-auto bg-black/90 font-mono text-xs space-y-3">
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[#00ff99] font-bold">$</span>
              <span className="text-white font-bold">{item.command}</span>
              <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
            </div>
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
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleCommand} className="bg-black border-t border-[#00ff99]/30 p-3 flex items-center gap-2">
        <span className="text-[#00ff99] font-mono font-bold text-sm">$</span>
        <input
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          placeholder="Type OSINT command (e.g. whois target.com, amass, nmap)..."
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
        />
        <GlowButton type="submit" variant="primary" icon={<Play size={12} />} className="!py-1 !px-3 !text-xs">
          Exec
        </GlowButton>
      </form>
    </div>
  );
};
