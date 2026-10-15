import React, { useState, useEffect } from 'react';
import { AdminStats } from '../../types';
import { api } from '../../services/api';
import {
  Calendar,
  Users,
  Ticket,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, onSelectEvent }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStats();
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (eventId: string, title: string) => {
    api.exportRegistrationsCsv(eventId, title).catch((err) => {
      alert(err.message || 'Export failed.');
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Aggregating live event metrics & database records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Event Operations Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time participant counts, seat capacity utilization, and registration telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/events/create')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-white block">{stats?.totalEvents ?? 0}</span>
          <span className="text-[11px] text-indigo-400 block font-medium">
            {stats?.publishedEvents ?? 0} Published & Live
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Registrations</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 block">
            {stats?.totalRegistrations ?? 0}
          </span>
          <span className="text-[11px] text-slate-400 block">Across all university tracks</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Registered Students</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-cyan-400 block">{stats?.totalStudents ?? 0}</span>
          <span className="text-[11px] text-slate-400 block">Verified student profiles</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Upcoming Events</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-purple-300 block">
            {stats?.upcomingEvents ?? 0}
          </span>
          <span className="text-[11px] text-slate-400 block">Active future schedules</span>
        </div>
      </div>

      {/* Capacity & Event-wise Occupancy */}
      <div className="p-6 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Event Capacity & Enrollment Monitor</h3>
            <p className="text-xs text-slate-400">
              Live seat fulfillment, occupancy percentages, and instant CSV export
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/events')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 self-start"
          >
            <span>Manage All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 pr-4">Event Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 w-48">Occupancy / Capacity</th>
                <th className="py-3 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.eventStats?.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pr-4">
                    <span
                      onClick={() => onSelectEvent(evt.id)}
                      className="font-semibold text-white hover:text-purple-300 transition-colors cursor-pointer block line-clamp-1"
                    >
                      {evt.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    {new Date(evt.event_date + 'T00:00:00').toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        evt.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : evt.status === 'closed'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white font-medium">
                          {evt.registered_count} / {evt.max_participants}
                        </span>
                        <span className="text-slate-400">{evt.fill_percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            evt.fill_percentage >= 100
                              ? 'bg-rose-500'
                              : evt.fill_percentage > 70
                              ? 'bg-amber-400'
                              : 'bg-purple-500'
                          }`}
                          style={{ width: `${evt.fill_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/events/${evt.id}/registrations`)}
                        className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                        title="View Registrations"
                      >
                        Registrations
                      </button>
                      <button
                        onClick={() => handleExport(evt.id, evt.title)}
                        className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Export CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Registrations Feed */}
      <div className="p-6 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Student Registrations</h3>
            <p className="text-xs text-slate-400">Latest submissions recorded in the database</p>
          </div>
          <button
            onClick={() => navigate('/admin/events')}
            className="text-xs text-purple-400 hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 pr-4">Student Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 pl-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recentRegistrations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-4 font-medium text-white">{reg.student?.full_name}</td>
                  <td className="py-3 px-3 text-slate-400">{reg.student?.email}</td>
                  <td className="py-3 px-3 text-slate-300 line-clamp-1">{reg.event?.title}</td>
                  <td className="py-3 px-3 text-indigo-300">{reg.team_name || 'Individual'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 capitalize">
                      {reg.registration_status}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-slate-400 whitespace-nowrap">
                    {new Date(reg.registered_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
