import React, { useState, useEffect } from 'react';
import { Registration } from '../../types';
import { api } from '../../services/api';
import { TicketModal } from '../../components/TicketModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ArrowRight,
  Printer,
  Trash2,
} from 'lucide-react';

interface MyRegistrationsPageProps {
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
}

export const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({
  navigate,
  onSelectEvent,
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);
  const [cancelModalReg, setCancelModalReg] = useState<Registration | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.getMyRegistrations();
      setRegistrations(res.registrations);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!cancelModalReg) return;
    setCancelling(true);
    try {
      await api.cancelRegistration(cancelModalReg.id);
      setToastMessage('Registration cancelled successfully.');
      setCancelModalReg(null);
      await loadRegistrations();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  const filtered = registrations.filter((r) => {
    if (statusFilter !== 'all' && r.registration_status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = r.event?.title.toLowerCase() || '';
      const category = r.event?.category.toLowerCase() || '';
      const team = r.team_name?.toLowerCase() || '';
      return title.includes(q) || category.includes(q) || team.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Registration Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Event Registrations</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your confirmed event passes, review squad rosters, or manage attendance.
          </p>
        </div>

        <button
          onClick={() => navigate('/events')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Find More Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1424] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0E1424] border border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({registrations.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'cancelled'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0E1424] border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No registrations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'You have not registered for any events yet. Check out the latest technical competitions.'}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Browse Technical Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => {
            const isConfirmed = reg.registration_status === 'confirmed';
            const isCancelled = reg.registration_status === 'cancelled';
            const eventDate = reg.event?.event_date
              ? new Date(reg.event.event_date + 'T00:00:00').toLocaleDateString()
              : 'TBA';

            return (
              <div
                key={reg.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0E1424] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row gap-5"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={reg.event?.banner_url}
                    alt={reg.event?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                    {reg.event?.category || 'Technical'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isConfirmed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isCancelled
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isConfirmed ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{reg.registration_status}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {reg.id.toUpperCase()}
                    </span>
                  </div>

                  <h3
                    onClick={() => reg.event && onSelectEvent(reg.event.id)}
                    className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {reg.event?.title || 'Technical Competition'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {eventDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {reg.event?.start_time} - {reg.event?.end_time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="truncate max-w-xs">{reg.event?.venue}</span>
                    </span>
                  </div>

                  {reg.team_name && (
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[11px]">Team: </span>
                        <span className="font-semibold text-white">{reg.team_name}</span>
                        {reg.team_members && reg.team_members.length > 0 && (
                          <span className="text-slate-400 text-[11px] ml-2">
                            ({reg.team_members.length + 1} members)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {isConfirmed && (
                    <button
                      onClick={() => setSelectedTicket(reg)}
                      className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => setCancelModalReg(reg)}
                      className="py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelModalReg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Cancel Registration?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to cancel your registration for{' '}
                <span className="text-white font-medium">{cancelModalReg.event?.title}</span>? Your
                allocated seat will be released back to the participant pool.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalReg(null)}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
              >
                Keep Registration
              </button>
              <button
                type="button"
                onClick={handleCancelRegistration}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
