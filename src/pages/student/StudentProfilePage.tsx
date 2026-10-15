import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Mail, Building, Phone, Calendar, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    college_name: user?.college_name || '',
    department: user?.department || '',
    year_of_study: user?.year_of_study || '3rd Year',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.updateProfile(formData);
      await refreshUser();
      setSuccessMsg('Your profile details have been successfully updated.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your verified college credentials and contact details used for event registrations.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 shadow-xl space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.full_name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user?.role}
              </span>
              <span className="text-[11px] text-slate-500">
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address (Verified)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              College / University
            </label>
            <input
              type="text"
              required
              value={formData.college_name}
              onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
              <select
                value={formData.year_of_study}
                onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Postgraduate / Master's">Postgraduate / Master&apos;s</option>
                <option value="PhD Candidate">PhD Candidate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
