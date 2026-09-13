import React, { useState } from 'react';
import type { AdminOverview as AdminOverviewType } from '../../types';
import { FileText, Download, ShieldCheck, CheckCircle2, Printer, Layers, Database } from 'lucide-react';

interface ReportsPanelProps {
  overview: AdminOverviewType | null;
}

export const ReportsPanel: React.FC<ReportsPanelProps> = ({ overview }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportJson = () => {
    if (!overview) return;
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportId: 'REP-SYS-' + Math.floor(100000 + Math.random() * 900000),
      system: 'FORENX AI LEARNOSINT Platform',
      securityStatus: 'AUTHORIZED_AUDIT',
      data: overview,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'forenx-admin-report-' + new Date().toISOString().slice(0, 10) + '.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#00ff99]">EXECUTIVE AUDIT // REPORTING MATRIX</p>
          <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <FileText size={20} className="text-[#00ff99]" />
            Platform Statistics & Audit Reports
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-xs hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <Printer size={14} />
            <span>Print Audit</span>
          </button>
          <button onClick={handleExportJson} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ff99] text-black font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(0,255,153,0.4)] transition-all cursor-pointer">
            <Download size={14} />
            <span>Export JSON Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Report generated and downloaded to your workstation successfully.</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#080808]/90 p-6 space-y-6 font-mono text-xs shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-white/10 gap-4">
          <div>
            <span className="px-2 py-0.5 rounded bg-[#00ff99]/15 text-[#00ff99] border border-[#00ff99]/30 text-[10px] font-bold">
              CLASSIFIED // ADMIN REPORT
            </span>
            <h3 className="text-base font-bold text-white mt-2">FORENX AI LEARNOSINT Platform State Summary</h3>
            <p className="text-[11px] text-slate-400">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right font-mono">
            <p className="text-[10px] text-slate-500">AUTHENTICATION CLEARANCE</p>
            <p className="text-xs font-bold text-cyan-400 flex items-center gap-1 sm:justify-end"><ShieldCheck size={14} /> ADMIN_VERIFIED</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"><Database size={14} className="text-[#00ff99]" /> 1. User Directory & Enrollment Census</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div><p className="text-[10px] text-slate-500">TOTAL ACCOUNTS</p><p className="text-lg font-bold text-white mt-0.5">{overview?.users.total || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">STUDENT COHORT</p><p className="text-lg font-bold text-[#00ff99] mt-0.5">{overview?.users.students || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">ADMINISTRATORS</p><p className="text-lg font-bold text-purple-400 mt-0.5">{overview?.users.admins || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">VERIFIED USERS</p><p className="text-lg font-bold text-emerald-400 mt-0.5">{overview?.users.verifiedStudents || 0}</p></div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"><Layers size={14} className="text-cyan-400" /> 2. Curriculum Asset Matrix</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div><p className="text-[10px] text-slate-500">OSINT TOOLS</p><p className="text-lg font-bold text-white mt-0.5">{overview?.learning.tools || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">INTERACTIVE LESSONS</p><p className="text-lg font-bold text-cyan-400 mt-0.5">{overview?.learning.lessons || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">QUIZ QUESTIONS</p><p className="text-lg font-bold text-amber-400 mt-0.5">{overview?.learning.quizzes || 0}</p></div>
            <div><p className="text-[10px] text-slate-500">PRACTICE LABS</p><p className="text-lg font-bold text-rose-400 mt-0.5">{overview?.learning.labs || 0}</p></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#00ff99]/5 border border-[#00ff99]/20 space-y-2">
          <p className="font-bold text-white text-xs">Administrative Guidance & Notes</p>
          <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
            <li>Ensure all student questions in the quiz catalog maintain clear contextual explanations.</li>
            <li>Maintain regular verification checks for newly enrolled student accounts.</li>
            <li>Ready for future automated scheduled weekly PDF reporting extension.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};