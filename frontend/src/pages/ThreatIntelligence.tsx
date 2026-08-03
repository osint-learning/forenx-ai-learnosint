import React, { useState } from 'react';
import { INITIAL_THREAT_MARKERS } from '../constants';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import { Globe, Search, Activity, Database, ExternalLink } from 'lucide-react';

export const ThreatIntelligence: React.FC = () => {
  const [markers] = useState(INITIAL_THREAT_MARKERS);
  const [ipQuery, setIpQuery] = useState('198.51.100.99');
  const [reputationResult, setReputationResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleIpSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipQuery.trim()) return;

    setIsQuerying(true);
    setTimeout(() => {
      setReputationResult({
        ip: ipQuery,
        virusTotal: { pos: 14, total: 90, status: 'Malicious' },
        abuseIpDb: { confidenceScore: 88, totalReports: 42 },
        urlScan: { verdict: 'Malicious C2 Relay', targetDomain: 'phantom-c2.cc' }
      });
      setIsQuerying(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6">
        <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
          <Globe className="text-[#00ff99]" size={32} />
          THREAT INTELLIGENCE <span className="neon-text-emerald">// GLOBAL MAP</span>
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
          Real-time global threat markers, VirusTotal integration simulation, and AbuseIPDB indicators.
        </p>
      </div>

      {/* Global Interactive Threat Grid */}
      <GlassCard glow="emerald" className="p-6 relative min-h-[400px] flex items-center justify-center overflow-hidden cyber-grid">
        <div className="absolute top-4 left-6 font-mono text-xs text-[#00ff99] flex items-center gap-2">
          <Activity size={14} className="animate-pulse" />
          <span>ACTIVE GLOBAL THREAT INDICATORS</span>
        </div>

        {/* Threat Markers Grid Display */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10 my-8">
          {markers.map(m => (
            <GlassCard key={m.id} glow="cyan" className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={m.threatLevel === 'Critical' ? 'warning' : 'emerald'}>{m.threatLevel}</Badge>
                <span className="text-[10px] font-mono text-slate-400">{m.timestamp}</span>
              </div>
              <div className="font-mono font-bold text-white text-sm">{m.country} ({m.city})</div>
              <div className="text-xs font-mono text-[#00ff99]">{m.ip}</div>
              <p className="text-[11px] font-mono text-slate-300">{m.type}</p>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      {/* IP Reputation Lookup (VirusTotal, AbuseIPDB) */}
      <GlassCard glow="cyan" className="p-6 space-y-6">
        <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
          <Database size={20} className="text-[#7efeff]" /> Threat Provider Reputation Lookup
        </h3>

        <form onSubmit={handleIpSearch} className="flex gap-4">
          <input
            type="text"
            value={ipQuery}
            onChange={e => setIpQuery(e.target.value)}
            placeholder="Search IP or Hash (e.g. 198.51.100.99)..."
            className="flex-1 bg-black/80 border border-[#7efeff]/40 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#7efeff]"
          />
          <GlowButton type="submit" variant="secondary" icon={<Search size={14} />}>
            {isQuerying ? 'Querying...' : 'Query Threat Feeds'}
          </GlowButton>
        </form>

        {reputationResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
            <div className="p-4 rounded-xl bg-black/60 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>VirusTotal</span>
                <ExternalLink size={14} />
              </div>
              <div className="text-lg text-white font-bold">{reputationResult.virusTotal.pos} / {reputationResult.virusTotal.total} Engines</div>
              <span className="text-[10px] text-rose-300">Verdict: {reputationResult.virusTotal.status}</span>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>AbuseIPDB</span>
                <ExternalLink size={14} />
              </div>
              <div className="text-lg text-white font-bold">{reputationResult.abuseIpDb.confidenceScore}% Confidence</div>
              <span className="text-[10px] text-amber-300">{reputationResult.abuseIpDb.totalReports} Abuse Reports</span>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-[#00ff99]/40 space-y-2">
              <div className="flex items-center justify-between text-[#00ff99] font-bold">
                <span>URLScan.io</span>
                <ExternalLink size={14} />
              </div>
              <div className="text-lg text-white font-bold">{reputationResult.urlScan.verdict}</div>
              <span className="text-[10px] text-[#7efeff]">Target: {reputationResult.urlScan.targetDomain}</span>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
