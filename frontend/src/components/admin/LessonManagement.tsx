import React, { useState, useEffect } from 'react';
import { OsintService } from '../../services/api';
import type { AdminLesson, OsintTool } from '../../types';
import { BookOpen, Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

export const LessonManagement: React.FC = () => {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [tools, setTools] = useState<OsintTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toolFilter, setToolFilter] = useState<string>('All');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    toolId: '',
    lessonNumber: 1,
    title: '',
    shortDescription: '',
    content: '',
    keyPointsText: '',
    estimatedTime: 5,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [lessonsData, toolsData] = await Promise.all([
        OsintService.getAllLessonsAdmin(),
        OsintService.getTools(),
      ]);
      setLessons(lessonsData);
      setTools(toolsData);
    } catch (err: any) {
      console.error('Fetch lessons error:', err);
      setError(err?.response?.data?.message || 'Failed to load lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActiveLessonId(null);
    setFormData({
      toolId: tools[0]?.id || '',
      lessonNumber: lessons.length + 1,
      title: '',
      shortDescription: '',
      content: '',
      keyPointsText: '',
      estimatedTime: 5,
      difficulty: 'Beginner',
    });
  };

  const handleOpenEdit = (lesson: AdminLesson) => {
    setModalMode('edit');
    setActiveLessonId(lesson._id);
    const keyPointsText = lesson.keyPoints?.join('\n') || '';
    const toolId = typeof lesson.tool === 'object' ? lesson.tool?._id || lesson.tool?.id : lesson.tool;
    setFormData({
      toolId: toolId || '',
      lessonNumber: lesson.lessonNumber || 1,
      title: lesson.title,
      shortDescription: lesson.shortDescription || '',
      content: lesson.content || '',
      keyPointsText,
      estimatedTime: lesson.estimatedTime || 5,
      difficulty: lesson.difficulty || 'Beginner',
    });
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const keyPoints = formData.keyPointsText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = {
        tool: formData.toolId,
        lessonNumber: formData.lessonNumber,
        title: formData.title,
        shortDescription: formData.shortDescription,
        content: formData.content,
        keyPoints,
        estimatedTime: formData.estimatedTime,
        difficulty: formData.difficulty,
      };

      if (modalMode === 'create') {
        await OsintService.createLesson(payload);
        setFeedback({ type: 'success', message: 'Lesson "' + formData.title + '" created successfully.' });
      } else if (modalMode === 'edit' && activeLessonId) {
        await OsintService.updateLesson(activeLessonId, payload);
        setFeedback({ type: 'success', message: 'Lesson "' + formData.title + '" updated successfully.' });
      }

      setModalMode(null);
      fetchData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to save lesson.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await OsintService.deleteLesson(deleteId);
      setFeedback({ type: 'success', message: 'Lesson deleted successfully.' });
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to delete lesson.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (toolFilter !== 'All') {
      const toolId = typeof lesson.tool === 'object' ? lesson.tool?._id || lesson.tool?.id : lesson.tool;
      return toolId === toolFilter;
    }
    return true;
  });

  const getToolName = (tool: any) => {
    if (!tool) return 'General';
    if (typeof tool === 'object' && tool.name) return tool.name;
    const found = tools.find((t) => t.id === tool);
    return found ? found.name : 'Tool';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">CURRICULUM // MODULE SYSTEM</p>
          <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <BookOpen size={20} className="text-cyan-400" />
            Lesson Management
          </h2>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(126,254,255,0.4)] transition-all cursor-pointer shrink-0">
          <Plus size={16} />
          <span>Add Lesson</span>
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
            placeholder="Search lessons by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <select
          value={toolFilter}
          onChange={(e) => setToolFilter(e.target.value)}
          className="bg-[#080808] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All OSINT Tools</option>
          {tools.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#080808]/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>LOADING LESSON CURRICULUM...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 font-mono text-xs">{error}</div>
        ) : filteredLessons.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">No lessons found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-500 uppercase text-[10px]">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Lesson Title</th>
                  <th className="px-5 py-3.5">Tool Target</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-[#00ff99] font-bold">#{lesson.lessonNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{lesson.title}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-sm">{lesson.shortDescription}</p>
                    </td>
                    <td className="px-5 py-3.5 text-cyan-400 font-bold">{getToolName(lesson.tool)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${lesson.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : lesson.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {lesson.difficulty || 'Beginner'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{lesson.estimatedTime || 5} min</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenEdit(lesson)} title="Edit Lesson" className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(lesson._id)} title="Delete Lesson" className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer">
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
          <form onSubmit={handleSaveLesson} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-cyan-400" />
                {modalMode === 'create' ? 'Create Lesson Module' : 'Edit Lesson Module'}
              </h3>
              <button type="button" onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">OSINT Tool *</label>
                  <select required value={formData.toolId} onChange={(e) => setFormData({ ...formData, toolId: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50">
                    {tools.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Lesson Number *</label>
                  <input type="number" min="1" required value={formData.lessonNumber} onChange={(e) => setFormData({ ...formData, lessonNumber: parseInt(e.target.value) || 1 })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Lesson Title *</label>
                <input type="text" required placeholder="e.g. Performing Advanced Reverse DNS Lookups" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Estimated Time (minutes)</label>
                  <input type="number" min="1" value={formData.estimatedTime} onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 5 })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Short Description</label>
                <input type="text" placeholder="Brief summary of lesson objectives" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Lesson Content *</label>
                <textarea rows={6} required placeholder="Comprehensive walkthrough content..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Key Takeaway Points (one per line)</label>
                <textarea rows={3} placeholder="Key takeaway point" value={formData.keyPointsText} onChange={(e) => setFormData({ ...formData, keyPointsText: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer">Cancel</button>
              <button type="submit" disabled={saveLoading} className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-bold text-xs hover:shadow-[0_0_15px_rgba(126,254,255,0.4)] transition-all cursor-pointer disabled:opacity-50">
                {saveLoading ? 'Saving...' : modalMode === 'create' ? 'Create Lesson' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400"><AlertTriangle size={20} /><h3 className="text-sm font-bold">Confirm Lesson Deletion</h3></div>
            <p className="text-slate-300 text-[11px] leading-relaxed">Are you sure you want to delete this lesson module?</p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50">
                {deleteLoading ? 'Deleting...' : 'Delete Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};