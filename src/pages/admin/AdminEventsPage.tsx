import React, { useState, useEffect } from 'react';
import { TechnicalEvent, EventCategory } from '../../types';
import { api } from '../../services/api';
import {
  Calendar,
  Plus,
  Search,
  Edit3,
  Trash2,
  Users,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface AdminEventsPageProps {
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
}

export const AdminEventsPage: React.FC<AdminEventsPageProps> = ({ navigate, onSelectEvent }) => {
  const [events, setEvents] = useState<TechnicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deleteEventTarget, setDeleteEventTarget] = useState<TechnicalEvent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents({ includeDrafts: true });
      setEvents(res.events);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    setStatusUpdatingId(eventId);
    try {
      await api.updateEventStatus(eventId, newStatus);
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update event status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteEventTarget) return;
    setDeleting(true);
    try {
      await api.deleteEvent(deleteEventTarget.id);
      setDeleteEventTarget(null);
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = (event: TechnicalEvent) => {
    api.exportRegistrationsCsv(event.id, event.title).catch((err) => {
      alert(err.message || 'Export failed.');
    });
  };

  const filtered = events.filter((e) => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizer_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Event Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Technical Events</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, modify, toggle publication status, and monitor seat allocations.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/events/create')}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Controls: Search & Category */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="All">All Categories</option>
            <option value="Hackathons">Hackathons</option>
            <option value="Coding Competitions">Coding Competitions</option>
            <option value="Robotics">Robotics</option>
            <option value="Workshops">Workshops</option>
            <option value="Project Exhibitions">Project Exhibitions</option>
            <option value="Paper Presentations">Paper Presentations</option>
            <option value="Technical Quizzes">Technical Quizzes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Date & Time</th>
                <th className="py-3.5 px-3">Format</th>
                <th className="py-3.5 px-3">Enrollment</th>
                <th className="py-3.5 px-3">Status Control</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading events...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No technical events found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => {
                  const regCount = evt.registered_count || 0;
                  const max = evt.max_participants;
                  const percent = Math.min(100, Math.round((regCount / max) * 100));

                  return (
                    <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.banner_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                          <div>
                            <span
                              onClick={() => onSelectEvent(evt.id)}
                              className="font-bold text-white hover:text-purple-300 transition-colors cursor-pointer block line-clamp-1 max-w-xs"
                            >
                              {evt.title}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                              {evt.venue}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                          {evt.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                        <div>{new Date(evt.event_date + 'T00:00:00').toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-500">
                          {evt.start_time} - {evt.end_time}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-slate-300 capitalize block font-medium">
                          {evt.registration_type}
                        </span>
                        {evt.registration_type === 'team' && (
                          <span className="text-[10px] text-slate-500">
                            {evt.min_team_size}-{evt.max_team_size} members
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-white font-medium">
                              {regCount} / {max}
                            </span>
                            <span className="text-slate-400">{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 100 ? 'bg-rose-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          disabled={statusUpdatingId === evt.id}
                          value={evt.status}
                          onChange={(e) => handleStatusChange(evt.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize focus:outline-none cursor-pointer border ${
                            evt.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : evt.status === 'closed'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <option value="draft" className="bg-[#0F1424] text-slate-300">
                            Draft (Hidden)
                          </option>
                          <option value="published" className="bg-[#0F1424] text-slate-300">
                            Published (Open)
                          </option>
                          <option value="closed" className="bg-[#0F1424] text-slate-300">
                            Closed
                          </option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEvent(evt.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Public View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/events/${evt.id}/edit`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/events/${evt.id}/registrations`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="Manage Registrations"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleExportCsv(evt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                            title="Export CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteEventTarget(evt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteEventTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Technical Event?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete{' '}
                <span className="text-white font-medium">{deleteEventTarget.title}</span>? All
                associated registrations and participant records will also be removed. This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteEventTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
