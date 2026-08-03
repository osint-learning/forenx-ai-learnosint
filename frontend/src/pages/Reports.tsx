import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import { FileText, Download, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Reports: React.FC = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleExportPdf = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    alert('Exporting Executive PDF Security Report for phantom-corp-sec.org...');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
            <FileText className="text-[#00ff99]" size={32} />
            INTELLIGENCE REPORTS <span className="neon-text-emerald">// EXPORTS</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Generate executive vulnerability reports, risk breakdowns, and timeline summaries.
          </p>
        </div>

        <div className="flex gap-3">
          <GlowButton variant="secondary" icon={<Eye size={14} />} onClick={() => setShowPreviewModal(true)}>
            HTML Preview
          </GlowButton>
          <GlowButton variant="primary" icon={<Download size={14} />} onClick={handleExportPdf}>
            Export PDF
          </GlowButton>
        </div>
      </div>

      {/* Main Report Card */}
      <GlassCard glow="emerald" className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Badge variant="emerald">CONFIDENTIAL OSINT REPORT</Badge>
            <h2 className="text-2xl font-mono font-bold text-white mt-2">Target Assessment: phantom-corp-sec.org</h2>
            <p className="text-xs font-mono text-slate-400 mt-1">Generated on August 1, 2026 by ForenX AI OSINT Core</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Overall Risk Score</span>
            <div className="text-3xl font-bold font-mono text-rose-400">78 / 100</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2 font-mono">
          <h4 className="text-xs font-bold text-[#00ff99] uppercase">Executive Summary</h4>
          <p className="text-xs text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">
            Automated intelligence collection against target domain <span className="text-white font-bold">phantom-corp-sec.org</span> uncovered multiple exposed network services including unauthenticated SCADA telemetry endpoints and softfail email SPF policies susceptible to domain spoofing.
          </p>
        </div>

        {/* Findings Count Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <div className="text-lg font-bold">1 Critical</div>
            <span className="text-[10px] text-slate-400">CVE-2023-9918 SCADA</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <div className="text-lg font-bold">2 High</div>
            <span className="text-[10px] text-slate-400">Exposed Staging API</span>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <div className="text-lg font-bold">3 Medium</div>
            <span className="text-[10px] text-slate-400">Permissive SPF</span>
          </div>
          <div className="p-3 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/30 text-[#00ff99]">
            <div className="text-lg font-bold">4 Low</div>
            <span className="text-[10px] text-slate-400">DNS Banner Info</span>
          </div>
        </div>
      </GlassCard>

      {/* HTML Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <GlassCard glow="cyan" className="w-full max-w-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-mono font-bold text-white text-sm">HTML Report Document Preview</h3>
              <GlowButton variant="ghost" onClick={() => setShowPreviewModal(false)}>Close</GlowButton>
            </div>

            <div className="bg-black/90 p-4 rounded-lg font-mono text-xs text-[#00ff99] border border-[#00ff99]/30 space-y-2">
              <pre className="whitespace-pre-wrap">{`<!DOCTYPE html>
<html>
<head>
  <title>Executive OSINT Intelligence Report</title>
</head>
<body style="background: #030303; color: #fff;">
  <h1>FORENX AI SECURITY ASSESSMENT</h1>
  <h2>Target: phantom-corp-sec.org</h2>
  <p>Risk Rating: HIGH (78/100)</p>
</body>
</html>`}</pre>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
