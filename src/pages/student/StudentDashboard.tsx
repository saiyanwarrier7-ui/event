import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Registration, TechnicalEvent } from '../../types';
import { api } from '../../services/api';
import { TicketModal } from '../../components/TicketModal';
import {
  Calendar,
  Ticket,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  Compass,
} from 'lucide-react';

interface StudentDashboardProps {
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  navigate,
  onSelectEvent,
}) => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<TechnicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [regRes, evtRes] = await Promise.all([
        api.getMyRegistrations(),
        api.getEvents(),
      ]);
      setRegistrations(regRes.registrations);

      const registeredIds = new Set(regRes.registrations.map((r) => r.event_id));
      const available = evtRes.events.filter((e) => !registeredIds.has(e.id)).slice(0, 3);
      setRecommendedEvents(available);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeRegistrations = registrations.filter((r) => r.registration_status === 'confirmed');
  const nextEventReg = activeRegistrations.find(
    (r) => r.event && new Date(r.event.event_date) >= new Date()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#0F1424] to-purple-900/50 border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Student Innovation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user?.department} • {user?.college_name} ({user?.year_of_study})
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Events</span>
          </button>
          <button
            onClick={() => navigate('/student/registrations')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>My Registrations ({registrations.length})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs">Total Registrations</span>
            <span className="text-2xl font-bold text-white block mt-0.5">{registrations.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs">Confirmed Passes</span>
            <span className="text-2xl font-bold text-emerald-400 block mt-0.5">
              {activeRegistrations.length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs">Team Events</span>
            <span className="text-2xl font-bold text-cyan-400 block mt-0.5">
              {registrations.filter((r) => r.team_name).length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1424] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs">Technical Status</span>
            <span className="text-base font-bold text-purple-300 block mt-0.5">Active Innovator</span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Registered Event Card */}
      {nextEventReg?.event && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Your Next Upcoming Event
              </span>
              <h3 className="text-xl font-bold text-white">{nextEventReg.event.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {new Date(nextEventReg.event.event_date + 'T00:00:00').toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {nextEventReg.event.start_time} - {nextEventReg.event.end_time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {nextEventReg.event.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSelectedTicket(nextEventReg)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>View Event Pass</span>
              </button>
              <button
                onClick={() => onSelectEvent(nextEventReg.event_id)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Event Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Registrations & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Registered Events</h3>
            <button
              onClick={() => navigate('/student/registrations')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0E1424] border border-slate-800 text-center space-y-3">
              <Ticket className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No registrations yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore our catalog of exciting technical competitions and reserve your spot today.
              </p>
              <button
                onClick={() => navigate('/events')}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 4).map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        {reg.event?.category || 'Technical'}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          reg.registration_status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {reg.registration_status}
                      </span>
                    </div>

                    <h4
                      onClick={() => onSelectEvent(reg.event_id)}
                      className="font-bold text-white text-sm hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      {reg.event?.title || 'Technical Event'}
                    </h4>

                    <p className="text-xs text-slate-400">
                      {reg.event?.event_date &&
                        new Date(reg.event.event_date + 'T00:00:00').toLocaleDateString()}{' '}
                      • {reg.event?.venue}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(reg)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Tracks (1 col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Recommended Events</h3>
          <div className="space-y-3">
            {recommendedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt.id)}
                className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {evt.category}
                  </span>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    {evt.available_seats} seats left
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {evt.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{evt.description}</p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{new Date(evt.event_date + 'T00:00:00').toLocaleDateString()}</span>
                  <span className="text-indigo-400 font-semibold group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
