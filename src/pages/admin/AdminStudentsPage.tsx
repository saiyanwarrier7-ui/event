import React, { useState, useEffect } from 'react';
import { StudentListItem } from '../../types';
import { api } from '../../services/api';
import { Users, Search, Mail, Phone, Building, GraduationCap, Ticket, ArrowLeft } from 'lucide-react';

interface AdminStudentsPageProps {
  navigate: (path: string) => void;
}

export const AdminStudentsPage: React.FC<AdminStudentsPageProps> = ({ navigate }) => {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStudents();
      setStudents(res.students);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.college_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registered university students, departmental breakdowns, and event activity metrics.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 self-start sm:self-auto">
          {students.length} Total Verified Students
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, email, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-3">University Email</th>
                <th className="py-3.5 px-3">College & Department</th>
                <th className="py-3.5 px-3">Year of Study</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Total Registered</th>
                <th className="py-3.5 px-4 text-right">Active Passes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading student records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {s.full_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{s.full_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      <a href={`mailto:${s.email}`} className="hover:text-indigo-300 transition-colors">
                        {s.email}
                      </a>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      <div className="font-medium text-white">{s.department}</div>
                      <div className="text-[10px] text-slate-500">{s.college_name}</div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">{s.year_of_study}</td>

                    <td className="py-3.5 px-3 text-slate-400">{s.phone}</td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {s.total_registrations} Events
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                        {s.active_registrations} Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
