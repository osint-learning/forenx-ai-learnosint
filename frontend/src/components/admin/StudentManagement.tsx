import React, { useState, useEffect } from 'react';
import { OsintService } from '../../services/api';
import type { AdminStudent } from '../../types';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Eye,
  X,
  Zap,
  Shield,
  BookOpen,
  FlaskConical,
  AlertTriangle
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  const [viewStudent, setViewStudent] = useState<AdminStudent | null>(null);
  const [editStudent, setEditStudent] = useState<AdminStudent | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    xp: 0,
    level: 1,
    isVerified: false,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OsintService.getStudents();
      setStudents(data);
    } catch (err: any) {
      console.error('Fetch students error:', err);
      setError(err?.response?.data?.message || 'Failed to load students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenDetail = async (id: string) => {
    try {
      const student = await OsintService.getStudent(id);
      setViewStudent(student);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to load student details.' });
    }
  };

  const handleOpenEdit = (student: AdminStudent) => {
    setEditStudent(student);
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      xp: student.xp || 0,
      level: student.level || 1,
      isVerified: student.isVerified || false,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    try {
      setSaveLoading(true);
      const updated = await OsintService.updateStudent(editStudent._id, editForm);
      setStudents((prev) => prev.map((s) => (s._id === editStudent._id ? { ...s, ...updated } : s)));
      setFeedback({ type: 'success', message: 'Student ' + updated.fullName + ' updated successfully.' });
      setEditStudent(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to update student.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await OsintService.deleteStudent(deleteId);
      setStudents((prev) => prev.filter((s) => s._id !== deleteId));
      setFeedback({ type: 'success', message: 'Student deleted successfully.' });
      setDeleteId(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to delete student.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterVerified === 'verified') return student.isVerified;
    if (filterVerified === 'unverified') return !student.isVerified;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/10 bg-[#080808]/80">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#00ff99]">STUDENT DIRECTORY // CONTROL</p>
          <h2 className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
            <Users size={20} className="text-[#00ff99]" />
            Student Management
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10">
            Total: <strong className="text-white">{students.length}</strong>
          </span>
          <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Verified: <strong className="text-emerald-300">{students.filter((s) => s.isVerified).length}</strong>
          </span>
        </div>
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
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff99]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterVerified('all')}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${filterVerified === 'all' ? 'bg-[#00ff99]/15 text-[#00ff99] border-[#00ff99]/40 font-bold' : 'bg-[#080808] text-slate-400 border-white/10 hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterVerified('verified')}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${filterVerified === 'verified' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold' : 'bg-[#080808] text-slate-400 border-white/10 hover:text-white'}`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilterVerified('unverified')}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${filterVerified === 'unverified' ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold' : 'bg-[#080808] text-slate-400 border-white/10 hover:text-white'}`}
          >
            Unverified
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#080808]/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin" />
            <span>ACCESSING STUDENT DATABASE...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 font-mono text-xs">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">No students match your query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-500 uppercase text-[10px]">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Level</th>
                  <th className="px-5 py-3.5">XP</th>
                  <th className="px-5 py-3.5">Verification</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{student.fullName}</td>
                    <td className="px-5 py-3.5 text-slate-400">{student.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 text-[10px]">
                        LVL {student.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-bold">{student.xp} XP</td>
                    <td className="px-5 py-3.5">
                      {student.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          <CheckCircle size={10} />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          <XCircle size={10} />
                          UNVERIFIED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(student._id)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(student._id)}
                          title="Delete Student"
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

      {/* VIEW STUDENT DETAILS MODAL */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#00ff99]" />
                <h3 className="text-sm font-mono font-bold text-white">Student Profile Dossier</h3>
              </div>
              <button onClick={() => setViewStudent(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Full Name:</span>
                  <span className="text-white font-bold">{viewStudent.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="text-cyan-400">{viewStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="text-[#00ff99] uppercase">{viewStudent.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Joined:</span>
                  <span className="text-slate-300">{new Date(viewStudent.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span className="text-slate-400">Verification:</span>
                  {viewStudent.isVerified ? (
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  ) : (
                    <span className="text-amber-400 font-bold">UNVERIFIED</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#00ff99]/5 border border-[#00ff99]/20">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Zap size={12} className="text-[#00ff99]" />
                    Total XP
                  </p>
                  <p className="text-xl font-bold text-[#00ff99] mt-1">{viewStudent.xp} XP</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Shield size={12} className="text-cyan-400" />
                    Agent Level
                  </p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">Level {viewStudent.level}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2">
                  <BookOpen size={13} className="text-cyan-400" />
                  Completed Lessons ({viewStudent.completedLessons?.length || 0})
                </p>
                <div className="max-h-24 overflow-y-auto space-y-1 p-2 rounded-lg bg-black/40 border border-white/5">
                  {viewStudent.completedLessons?.length ? (
                    viewStudent.completedLessons.map((lesson, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 truncate">
                        • {lesson.title || 'Lesson #' + (lesson.lessonNumber || idx + 1)}
                      </p>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-500">No lessons completed yet.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2">
                  <FlaskConical size={13} className="text-rose-400" />
                  Completed Labs ({viewStudent.completedLabs?.length || 0})
                </p>
                <div className="max-h-24 overflow-y-auto space-y-1 p-2 rounded-lg bg-black/40 border border-white/5">
                  {viewStudent.completedLabs?.length ? (
                    viewStudent.completedLabs.map((lab, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 truncate">
                        • {lab.title || 'Lab #' + (idx + 1)}
                      </p>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-500">No practice labs completed yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewStudent(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-xs font-mono text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 size={16} className="text-cyan-400" />
                Edit Student Parameters
              </h3>
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">XP Points</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.xp}
                    onChange={(e) => setEditForm({ ...editForm, xp: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Level</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff99]/50"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Email Verification</p>
                  <p className="text-[10px] text-slate-500">Student verification badge status</p>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isVerified}
                  onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  className="w-4 h-4 accent-[#00ff99] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-4 py-2 rounded-lg bg-[#00ff99] text-black font-bold text-xs hover:shadow-[0_0_15px_rgba(0,255,153,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#080808] p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-bold">Confirm Student Deletion</h3>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Are you sure you want to delete this student? All their associated progress and session records will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};