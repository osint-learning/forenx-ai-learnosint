import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { Badge } from '../components/ui/Badge';
import {
  FolderSearch,
  Radar,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { OsintService } from '../services/api';
import type { InvestigationRecord } from '../types';

export const InvestigationsList: React.FC = () => {
  const navigate = useNavigate();

  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<InvestigationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchInvestigations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getInvestigations();
      setInvestigations(data || []);
    } catch (err: any) {
      console.error('Error fetching investigations:', err);
      setError(err.message || 'Failed to load investigations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleOpenWorkspace = (id: string) => {
    navigate('/investigations/' + id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await OsintService.deleteInvestigation(deleteTarget._id);
      setInvestigations(prev => prev.filter(item => item._id !== deleteTarget._id));
      setSuccessMessage(`Investigation on "${deleteTarget.target || deleteTarget.domain}" deleted successfully.`);
      setDeleteTarget(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete investigation:', err);
      alert(err.message || 'Failed to delete investigation.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase flex items-center gap-3">
            <Database className="text-[#00ff99]" size={32} />
            INVESTIGATION HISTORY <span className="neon-text-emerald">// SAVED RECON CASES</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your saved reconnaissance investigations, track methodology progress, and launch dedicated workspaces.
          </p>
        </div>

        <div className="flex gap-2">
          <GlowButton variant="secondary" onClick={fetchInvestigations} icon={<RefreshCw size={14} />}>
            Refresh Cases
          </GlowButton>
          <GlowButton variant="primary" onClick={() => navigate('/recon')} icon={<Radar size={14} />}>
            New Recon Scan
          </GlowButton>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-[#00ff99]/10 border border-[#00ff99]/40 rounded-xl text-xs text-[#00ff99] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <GlassCard glow="cyan" className="p-12 text-center space-y-4">
          <Loader2 size={36} className="animate-spin text-[#00ff99] mx-auto" />
          <p className="text-[#00ff99] text-sm">Loading saved investigations from database...</p>
        </GlassCard>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <GlassCard glow="none" className="p-8 border-rose-500/40 bg-rose-950/20 text-center space-y-4">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <p className="text-rose-300 text-sm">{error}</p>
          <GlowButton variant="secondary" onClick={fetchInvestigations} icon={<RefreshCw size={14} />}>
            Retry
          </GlowButton>
        </GlassCard>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && investigations.length === 0 && (
        <GlassCard glow="emerald" className="p-12 text-center space-y-6">
          <FolderSearch size={48} className="text-slate-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white">No Saved Investigations Found</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              You haven't sent any Recon Engine results to Investigation yet. Run a Recon scan and click <span className="text-[#00ff99]">"SEND TO INVESTIGATE"</span> to start your first case.
            </p>
          </div>
          <GlowButton variant="primary" icon={<Radar size={16} />} onClick={() => navigate('/recon')}>
            Launch Recon Engine
          </GlowButton>
        </GlassCard>
      )}

      {/* INVESTIGATION CARDS GRID */}
      {!loading && !error && investigations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Saved Investigation Cases ({investigations.length}):</span>
            <span className="text-[#00ff99]">Select a case to open in its dedicated Investigation Workspace</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {investigations.map(item => {
              const dateObj = new Date(item.createdAt);
              const dateStr = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              const progress = item.progress || 20;

              return (
                <GlassCard
                  key={item._id}
                  glow="none"
                  className="p-5 border border-white/10 hover:border-[#00ff99]/40 bg-black/50 transition-all flex flex-col justify-between space-y-4 hover:shadow-[0_0_15px_rgba(0,255,153,0.1)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <h3 className="text-base font-bold text-white truncate flex items-center gap-1.5">
                          <Radar size={16} className="text-[#00ff99] shrink-0" />
                          <span className="truncate">{item.target || item.domain}</span>
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {item.mission?.title || 'Recon Investigation'}
                        </span>
                      </div>
                      <Badge
                        variant={item.status === 'Completed' || progress === 100 ? 'emerald' : 'cyan'}
                        className="text-[10px] uppercase shrink-0"
                      >
                        {item.status || 'In Progress'}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar size={12} /> Date:
                        </span>
                        <span className="text-slate-300">{dateStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={12} /> Time:
                        </span>
                        <span className="text-slate-300">{timeStr}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Layers size={12} /> Investigation Progress:
                        </span>
                        <span className="text-[#00ff99] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-black/80 border border-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-[#00ff99] h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <GlowButton
                      variant="primary"
                      onClick={() => handleOpenWorkspace(item._id)}
                      icon={<ExternalLink size={14} />}
                      className="!py-1.5 !px-3 text-xs flex-1"
                    >
                      OPEN INVESTIGATION
                    </GlowButton>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-lg bg-black/60 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Delete Investigation"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md">
            <GlassCard glow="none" className="p-6 border border-rose-500/50 bg-rose-950/30 text-white space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={28} />
                <h3 className="text-lg font-bold uppercase">Confirm Case Deletion</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Delete this investigation for <strong className="text-white">"{deleteTarget.target || deleteTarget.domain}"</strong> and all collected Recon data?
              </p>

              <p className="text-[11px] text-slate-400 bg-black/60 p-3 rounded-lg border border-white/10 leading-relaxed">
                This will permanently remove the saved Recon results, mission, objectives, AI chat history, hints, findings, correlations, student evaluation, and report data.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <GlowButton
                  variant="secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="!py-1.5 text-xs"
                >
                  Cancel
                </GlowButton>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(225,29,72,0.4)]"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {isDeleting ? 'Deleting...' : 'Delete Case'}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
