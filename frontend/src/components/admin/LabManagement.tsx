import React, { useState, useEffect } from 'react';
import { OsintService } from '../../services/api';
import type { AdminLab } from '../../types';
import { FlaskConical, Plus, Search, Edit2, Trash2, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const LabManagement: React.FC = () => {
  const [labs, setLabs] = useState<AdminLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    tool: '',
    category: 'OSINT',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    target: '',
    missionBrief: '',
    requiredCommand: '',
    xpReward: 100,
    isActive: true,
    objectivesText: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getAdminLabs();
      setLabs(data);
    } catch (err: any) {
      console.error('Fetch labs error:', err);
      setError(err?.response?.data?.message || 'Failed to load practice labs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActiveLabId(null);
    setFormData({
      title: '',
      tool: 'WHOIS',
      category: 'OSINT',
      difficulty: 'Easy',
      target: 'example.com',
      missionBrief: '',
      requiredCommand: 'whois example.com',
      xpReward: 100,
      isActive: true,
      objectivesText: 'Find registrar name | registrar | answer',
    });
  };

  const handleOpenEdit = (lab: AdminLab) => {
    setModalMode('edit');
    setActiveLabId(lab._id);
    const objectivesText =
      lab.objectives?.map((obj) => obj.question + ' | ' + obj.expectedField + ' | ' + obj.type).join('\n') || '';
    setFormData({
      title: lab.title,
      tool: lab.tool,
      category: lab.category || 'OSINT',
      difficulty: lab.difficulty || 'Easy',
      target: lab.target,
      missionBrief: lab.missionBrief,
      requiredCommand: lab.requiredCommand,
      xpReward: lab.xpReward || 100,
      isActive: lab.isActive !== undefined ? lab.isActive : true,
      objectivesText,
    });
  };

  const handleSaveLab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const objectives = formData.objectivesText
        .split('\n')
        .filter((l) => l.trim())
        .map((l) => {
          const parts = l.split('|').map((s) => s.trim());
          return {
            question: parts[0] || 'Execute command to uncover target data',
            expectedField: parts[1] || 'result',
            type: (parts[2] === 'command' ? 'command' : 'answer') as 'command' | 'answer',
          };
        });

      const payload = {
        title: formData.title,
        tool: formData.tool,
        category: formData.category,
        difficulty: formData.difficulty,
        target: formData.target,
        missionBrief: formData.missionBrief,
        requiredCommand: formData.requiredCommand,
        xpReward: formData.xpReward,
        isActive: formData.isActive,
        objectives,
      };

      if (modalMode === 'create') {
        await OsintService.createLab(payload);
        setFeedback({ type: 'success', message: 'Lab "' + formData.title + '" created successfully.' });
      } else if (modalMode === 'edit' && activeLabId) {
        await OsintService.updateLab(activeLabId, payload);
        setFeedback({ type: 'success', message: 'Lab "' + formData.title + '" updated successfully.' });
      }

      setModalMode(null);
      fetchLabs();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to save lab.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await OsintService.deleteLab(deleteId);
      setFeedback({ type: 'success', message: 'Practice lab deleted successfully.' });
      setDeleteId(null);
      fetchLabs();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to delete lab.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.target.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (difficultyFilter !== 'All') return lab.difficulty === difficultyFilter;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400">PRACTICE ENVIRONMENT // LAB MATRIX</p>
          <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <FlaskConical size={20} className="text-rose-400" />
            Practice Lab Management
          </h2>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer shrink-0">
          <Plus size={16} />
          <span>Add Practice Lab</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border font-mono text-xs flex items-center justify-between ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search labs by title, tool or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-[#080808] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-rose-500/50 cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#080808]/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            <span>INITIALIZING LAB CONTROLLERS...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 font-mono text-xs">{error}</div>
        ) : filteredLabs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">No practice labs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-500 uppercase text-[10px]">
                  <th className="px-5 py-3.5">Lab Title</th>
                  <th className="px-5 py-3.5">Tool</th>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Reward</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLabs.map((lab) => (
                  <tr key={lab._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{lab.title}</p>
                      <p className="text-[11px] text-slate-500">{lab.objectives?.length || 0} Objectives</p>
                    </td>
                    <td className="px-5 py-3.5 text-cyan-400 font-bold">{lab.tool}</td>
                    <td className="px-5 py-3.5 text-slate-300">{lab.target}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${lab.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : lab.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {lab.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#00ff99] font-bold">+{lab.xpReward} XP</td>
                    <td className="px-5 py-3.5">
                      {lab.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]"><CheckCircle size={10} /> ACTIVE</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px]"><XCircle size={10} /> INACTIVE</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenEdit(lab)} title="Edit Lab" className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(lab._id)} title="Delete Lab" className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveLab} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><FlaskConical size={16} className="text-rose-400" />{modalMode === 'create' ? 'Create Practice Lab' : 'Edit Practice Lab'}</h3>
              <button type="button" onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Lab Title *</label>
                <input type="text" required placeholder="e.g. Investigating Target Domain Registrar & DNS" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tool Identifier *</label>
                  <input type="text" required placeholder="e.g. WHOIS" value={formData.tool} onChange={(e) => setFormData({ ...formData, tool: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">XP Reward</label>
                  <input type="number" min="10" value={formData.xpReward} onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Investigation Target *</label>
                  <input type="text" required placeholder="e.g. forenx-target.org" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Required Command *</label>
                  <input type="text" required placeholder="e.g. whois forenx-target.org" value={formData.requiredCommand} onChange={(e) => setFormData({ ...formData, requiredCommand: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mission Brief *</label>
                <textarea rows={3} required placeholder="Intelligence directive scenario..." value={formData.missionBrief} onChange={(e) => setFormData({ ...formData, missionBrief: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500/50" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Lab Objectives (Format: Question | ExpectedField | Type — one per line)</label>
                <textarea rows={3} placeholder="Find registrar | registrar | answer" value={formData.objectivesText} onChange={(e) => setFormData({ ...formData, objectivesText: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500/50" />
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div><p className="font-bold text-white">Active Status</p><p className="text-[10px] text-slate-500">Makes lab available in Practice Labs</p></div>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-[#00ff99] cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer">Cancel</button>
              <button type="submit" disabled={saveLoading} className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50">
                {saveLoading ? 'Saving...' : modalMode === 'create' ? 'Create Lab' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400"><AlertTriangle size={20} /><h3 className="text-sm font-bold">Confirm Lab Deletion</h3></div>
            <p className="text-slate-300 text-[11px] leading-relaxed">Are you sure you want to delete this practice lab?</p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50">
                {deleteLoading ? 'Deleting...' : 'Delete Lab'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};