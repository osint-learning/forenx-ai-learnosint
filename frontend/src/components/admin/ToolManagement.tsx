import React, { useState, useEffect } from 'react';
import { OsintService } from '../../services/api';
import type { OsintTool, ToolCategory } from '../../types';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

const CATEGORIES: ToolCategory[] = [
  'Search Engines',
  'Google Dorking',
  'Domain Investigation',
  'Email Investigation',
  'Username Investigation',
  'Phone Investigation',
  'Metadata Analysis',
  'Threat Intelligence',
];

export const ToolManagement: React.FC = () => {
  const [tools, setTools] = useState<OsintTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Domain Investigation' as ToolCategory,
    shortDescription: '',
    description: '',
    purpose: '',
    whenToUse: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    installation: '',
    commandsText: '',
    tagsText: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getTools();
      setTools(data);
    } catch (err: any) {
      console.error('Fetch tools error:', err);
      setError(err?.response?.data?.message || 'Failed to load OSINT tools.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActiveToolId(null);
    setFormData({
      name: '',
      category: 'Domain Investigation',
      shortDescription: '',
      description: '',
      purpose: '',
      whenToUse: '',
      difficulty: 'Beginner',
      installation: '',
      commandsText: '',
      tagsText: '',
    });
  };

  const handleOpenEdit = (tool: OsintTool) => {
    setModalMode('edit');
    setActiveToolId(tool.id);
    const commandsText = tool.commands?.map((c) => ((c as any).title || '') + ' | ' + c.command + ' | ' + (c.description || '')).join('\n') || '';
    const tagsText = tool.tags?.join(', ') || '';
    setFormData({
      name: tool.name,
      category: tool.category,
      shortDescription: tool.tagline || tool.description || '',
      description: tool.description || '',
      purpose: tool.purpose || '',
      whenToUse: tool.whenToUse || '',
      difficulty: tool.difficulty || 'Beginner',
      installation: tool.installation || '',
      commandsText,
      tagsText,
    });
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const commands = formData.commandsText
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const parts = line.split('|').map((s) => s.trim());
          return {
            title: parts[0] || 'Default Command',
            command: parts[1] || parts[0],
            explanation: parts[2] || '',
          };
        });

      const tags = formData.tagsText.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = {
        name: formData.name,
        category: formData.category,
        shortDescription: formData.shortDescription,
        description: formData.description,
        purpose: formData.purpose,
        whenToUse: formData.whenToUse,
        difficulty: formData.difficulty,
        installation: formData.installation,
        commands,
        tags,
      };

      if (modalMode === 'create') {
        await OsintService.createTool(payload);
        setFeedback({ type: 'success', message: 'Tool "' + formData.name + '" added successfully.' });
      } else if (modalMode === 'edit' && activeToolId) {
        await OsintService.updateTool(activeToolId, payload);
        setFeedback({ type: 'success', message: 'Tool "' + formData.name + '" updated successfully.' });
      }

      setModalMode(null);
      fetchTools();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to save tool.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await OsintService.deleteTool(deleteId);
      setFeedback({ type: 'success', message: 'Tool deleted successfully.' });
      setDeleteId(null);
      fetchTools();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to delete tool.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter !== 'All') return tool.category === categoryFilter;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#00ff99]">OSINT ARSENAL // SUITE MANAGEMENT</p>
          <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <Wrench size={20} className="text-[#00ff99]" />
            Tool Management
          </h2>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ff99] text-black font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(0,255,153,0.4)] transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add OSINT Tool</span>
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
            placeholder="Search tools by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff99]/50 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#080808] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#00ff99]/50 cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#080808]/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin" />
            <span>FETCHING TOOL ARSENAL...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 font-mono text-xs">{error}</div>
        ) : filteredTools.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">No tools found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-500 uppercase text-[10px]">
                  <th className="px-5 py-3.5">Tool Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Commands</th>
                  <th className="px-5 py-3.5">Tags</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{tool.name}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{tool.tagline || tool.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-cyan-400 font-bold">{tool.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${tool.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : tool.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {tool.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-bold">{tool.commands?.length || 0} syntax</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {tool.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tool)}
                          title="Edit Tool"
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(tool.id)}
                          title="Delete Tool"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        >
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

      {/* CREATE / EDIT TOOL MODAL */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTool}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench size={16} className="text-[#00ff99]" />
                {modalMode === 'create' ? 'Add New OSINT Tool' : 'Edit OSINT Tool'}
              </h3>
              <button type="button" onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tool Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WHOIS, Sublist3r, Sherlock"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Installation Command</label>
                  <input
                    type="text"
                    placeholder="e.g. pip install sherlock"
                    value={formData.installation}
                    onChange={(e) => setFormData({ ...formData, installation: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Short Description / Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="Concise overview of what this tool investigates"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed breakdown of mechanics and capabilities"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Commands (Format: Title | Command | Explanation — one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Scan Domain | whois forenx.ai | Query domain registrar records"
                  value={formData.commandsText}
                  onChange={(e) => setFormData({ ...formData, commandsText: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="dns, whois, domain, reconnaissance"
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-4 py-2 rounded-lg bg-[#00ff99] text-black font-bold text-xs hover:shadow-[0_0_15px_rgba(0,255,153,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {saveLoading ? 'Saving...' : modalMode === 'create' ? 'Create Tool' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-bold">Confirm Tool Deletion</h3>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Are you sure you want to delete this OSINT tool? Related practice exercises may be impacted.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50">
                {deleteLoading ? 'Deleting...' : 'Delete Tool'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};