import React, { useState, useEffect } from 'react';
import { Registration, TechnicalEvent, RegistrationStatus } from '../../types';
import { api } from '../../services/api';
import {
  Ticket,
  Search,
  Download,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Mail,
  Building,
  Phone,
  Eye,
  X,
} from 'lucide-react';

interface AdminRegistrationsPageProps {
  eventId?: string; // Optional filter by event
  navigate: (path: string) => void;
}

export const AdminRegistrationsPage: React.FC<AdminRegistrationsPageProps> = ({
  eventId,
  navigate,
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<TechnicalEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || 'All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<Registration | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedEventId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regRes, evtRes] = await Promise.all([
        api.getAdminRegistrations({
          eventId: selectedEventId !== 'All' ? selectedEventId : undefined,
        }),
        api.getEvents({ includeDrafts: true }),
      ]);
      setRegistrations(regRes.registrations);
      setEvents(evtRes.events);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (regId: string, newStatus: RegistrationStatus) => {
    setUpdatingId(regId);
    try {
      await api.updateRegistrationStatus(regId, newStatus);
      await loadData();
      if (selectedDetail?.id === regId) {
        setSelectedDetail((prev) => (prev ? { ...prev, registration_status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update registration status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = () => {
    const targetEvent = events.find((e) => e.id === selectedEventId) || events[0];
    if (!targetEvent) {
      alert('No event found to export.');
      return;
    }
    api.exportRegistrationsCsv(targetEvent.id, targetEvent.title).catch((err) => {
      alert(err.message || 'Export failed.');
    });
  };

  const filtered = registrations.filter((r) => {
    if (statusFilter !== 'All' && r.registration_status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const sName = r.student?.full_name?.toLowerCase() || '';
      const sEmail = r.student?.email?.toLowerCase() || '';
      const eTitle = r.event?.title?.toLowerCase() || '';
      const tName = r.team_name?.toLowerCase() || '';
      return sName.includes(q) || sEmail.includes(q) || eTitle.includes(q) || tName.includes(q);
    }
    return true;
  });

  const currentEventTitle =
    selectedEventId !== 'All'
      ? events.find((e) => e.id === selectedEventId)?.title || 'Selected Event'
      : 'All Technical Events';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/events')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Event Registrations</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Managing attendee records for <span className="text-purple-300 font-semibold">{currentEventTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, email, or team name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Event selector */}
        <div className="sm:col-span-4">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Events ({events.length})</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Student Registrant</th>
                <th className="py-3.5 px-3">College & Dept</th>
                <th className="py-3.5 px-3">Event</th>
                <th className="py-3.5 px-3">Format / Team</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Registered At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading registration records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-white block">{reg.student?.full_name}</span>
                        <span className="text-[11px] text-slate-400 block">{reg.student?.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      <div>{reg.student?.department}</div>
                      <div className="text-[10px] text-slate-500">{reg.student?.college_name}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-purple-300 line-clamp-1 block max-w-xs">
                        {reg.event?.title}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {reg.team_name ? (
                        <div>
                          <span className="font-semibold text-cyan-300 block">{reg.team_name}</span>
                          <span className="text-[10px] text-slate-400">
                            Squad: {(reg.team_members?.length || 0) + 1} members
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Individual</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          reg.registration_status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : reg.registration_status === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-300'
                            : reg.registration_status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {reg.registration_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(reg.registered_at).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDetail(reg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {reg.registration_status !== 'confirmed' && (
                          <button
                            disabled={updatingId === reg.id}
                            onClick={() => handleStatusUpdate(reg.id, 'confirmed')}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Approve / Confirm"
                          >
                            Approve
                          </button>
                        )}

                        {reg.registration_status === 'confirmed' && (
                          <button
                            disabled={updatingId === reg.id}
                            onClick={() => handleStatusUpdate(reg.id, 'cancelled')}
                            className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Cancel Pass"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Registration Detail Drawer/Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0F1424] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">
                  Registration Record
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedDetail.student?.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Event Title:</span>
                <p className="font-semibold text-white">{selectedDetail.event?.title}</p>
                <span className="text-slate-400 text-[11px]">
                  Venue: {selectedDetail.event?.venue}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Email:</span>
                  <span className="text-white font-medium truncate block">
                    {selectedDetail.student?.email}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Phone:</span>
                  <span className="text-white font-medium">{selectedDetail.student?.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">College:</span>
                  <span className="text-white font-medium">{selectedDetail.student?.college_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Department & Year:</span>
                  <span className="text-white font-medium">
                    {selectedDetail.student?.department} ({selectedDetail.student?.year_of_study})
                  </span>
                </div>
              </div>

              {selectedDetail.team_name && (
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">
                      Team: {selectedDetail.team_name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {(selectedDetail.team_members?.length || 0) + 1} total members
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] text-slate-300">
                      1. {selectedDetail.student?.full_name} ({selectedDetail.student?.email}) - Lead
                    </div>
                    {selectedDetail.team_members?.map((m, idx) => (
                      <div key={idx} className="text-[11px] text-slate-400">
                        {idx + 2}. {m.name} ({m.email}) - {m.department || 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick status actions in modal */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Current Status:{' '}
                <strong className="text-white capitalize">
                  {selectedDetail.registration_status}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedDetail.id, 'confirmed')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedDetail.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
