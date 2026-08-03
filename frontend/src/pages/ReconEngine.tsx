import React, { useState } from 'react';
import { OsintService } from '../services/api';
import type { ReconResult } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Radar, Search, Shield, Server } from 'lucide-react';

export const ReconEngine: React.FC = () => {
  const [targetInput, setTargetInput] = useState('phantom-corp-sec.org');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ReconResult | null>(null);

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim()) return;

    setIsScanning(true);
    setScanProgress(10);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    const data = await OsintService.executeReconScan(targetInput);
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setScanResult(data);
      setIsScanning(false);
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6">
        <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
          <Radar className="text-[#00ff99] animate-spin" size={32} />
          RECON ENGINE <span className="neon-text-emerald">// AUTOMATED DIAGNOSTICS</span>
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
          Perform multi-vector attack surface scanning, port diagnostics, and SSL telemetry.
        </p>
      </div>

      {/* Target Search Input Form */}
      <GlassCard glow="emerald" className="p-6">
        <form onSubmit={handleStartScan} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={targetInput}
              onChange={e => setTargetInput(e.target.value)}
              placeholder="Enter Target Domain or IP (e.g. target.com, 198.51.100.44)..."
              className="w-full bg-black/80 border border-[#00ff99]/40 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00ff99] focus:shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all"
            />
          </div>

          <GlowButton
            type="submit"
            variant="primary"
            disabled={isScanning}
            icon={<Radar size={18} />}
            className="w-full sm:w-auto !py-3 !px-6"
          >
            {isScanning ? 'Scanning Surface...' : 'Initiate Recon Scan'}
          </GlowButton>
        </form>
      </GlassCard>

      {/* Animated Radar Scanning Status */}
      {isScanning && (
        <GlassCard glow="cyan" className="p-8 text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff99]/30 animate-radar" />
            <Radar size={64} className="text-[#00ff99] animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-mono font-bold text-white">EXECUTING MULTI-VECTOR RECON...</h3>
            <p className="text-xs font-mono text-[#7efeff]">Querying DNS, Port Banners, SSL Chains, and Security Headers</p>
          </div>

          <div className="max-w-md mx-auto bg-black/60 rounded-full h-3 p-0.5 border border-[#00ff99]/30">
            <div
              className="bg-gradient-to-r from-[#00ff99] to-[#7efeff] h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,255,153,0.8)]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </GlassCard>
      )}

      {/* Recon Diagnostic Scan Results Dashboard */}
      {scanResult && !isScanning && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <GlassCard glow="emerald" className="p-4 flex items-center gap-4">
              <ProgressRing progress={scanResult.riskScore} size={64} color="#f43f5e" />
              <div>
                <span className="text-xs font-mono text-slate-400">Risk Meter</span>
                <div className="text-xl font-bold font-mono text-rose-400">{scanResult.riskScore} / 100</div>
                <span className="text-[10px] font-mono text-slate-400">Threat Grade: HIGH</span>
              </div>
            </GlassCard>

            <GlassCard glow="cyan" className="p-4">
              <span className="text-xs font-mono text-slate-400">Target IP</span>
              <div className="text-lg font-bold font-mono text-white">{scanResult.ipAddress}</div>
              <span className="text-[10px] font-mono text-[#7efeff]">{scanResult.geoCountry}</span>
            </GlassCard>

            <GlassCard glow="emerald" className="p-4">
              <span className="text-xs font-mono text-slate-400">Open Network Ports</span>
              <div className="text-lg font-bold font-mono text-[#00ff99]">{scanResult.openPorts.length} Ports Open</div>
              <span className="text-[10px] font-mono text-slate-400">Ports 80, 443, 8080</span>
            </GlassCard>

            <GlassCard glow="cyan" className="p-4">
              <span className="text-xs font-mono text-slate-400">SSL Certificate</span>
              <div className="text-lg font-bold font-mono text-emerald-400">Valid ({scanResult.sslStatus.expiresDays} days)</div>
              <span className="text-[10px] font-mono text-slate-400">DigiCert TLS</span>
            </GlassCard>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Ports & Services */}
            <GlassCard glow="emerald" className="p-6 space-y-4">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <Server size={18} className="text-[#00ff99]" /> Open Ports & Services
              </h3>
              <div className="space-y-2">
                {scanResult.openPorts.map((p, i) => (
                  <div key={i} className="p-3 rounded bg-black/60 border border-white/5 flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-[#00ff99]">Port {p.port}/TCP</span>
                    <span className="text-slate-300">{p.service}</span>
                    <Badge variant="emerald">{p.state}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Security Headers Check */}
            <GlassCard glow="cyan" className="p-6 space-y-4">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <Shield size={18} className="text-[#7efeff]" /> Security Headers Audit
              </h3>
              <div className="space-y-2">
                {scanResult.securityHeaders.map((h, i) => (
                  <div key={i} className="p-3 rounded bg-black/60 border border-white/5 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-300">{h.header}</span>
                    <Badge variant={h.status === 'Pass' ? 'emerald' : 'warning'}>{h.status}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
