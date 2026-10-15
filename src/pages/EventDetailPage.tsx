import React, { useState, useEffect } from 'react';
import { TechnicalEvent, Registration } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RegistrationModal } from '../components/RegistrationModal';
import { TicketModal } from '../components/TicketModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Share2,
  ArrowLeft,
  DollarSign,
  FileText,
  Lock,
  Ticket,
} from 'lucide-react';

interface EventDetailPageProps {
  eventId: string;
  navigate: (path: string) => void;
  onBack: () => void;
  registeredRegistration?: Registration;
  onRefreshRegistrations: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  eventId,
  navigate,
  onBack,
  registeredRegistration,
  onRefreshRegistrations,
}) => {
  const { isAuthenticated, isStudent } = useAuth();
  const [event, setEvent] = useState<TechnicalEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEventById(eventId);
      setEvent(res.event);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Loading event specifications...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'The requested event does not exist or has been removed.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs hover:bg-slate-700 transition-colors"
        >
          Return to Events
        </button>
      </div>
    );
  }

  const registered = event.registered_count || 0;
  const max = event.max_participants;
  const available = Math.max(0, max - registered);
  const isFull = registered >= max;
  const isExpired = new Date() > new Date(event.registration_deadline);
  const isClosed = event.status === 'closed';
  const isRegistered = Boolean(registeredRegistration);

  const formattedDate = new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const deadlineDate = new Date(event.registration_deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0E1424] shadow-2xl">
        <div className="h-64 sm:h-80 lg:h-96 w-full relative">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1424] via-[#0E1424]/60 to-transparent"></div>

          {/* Badges on banner */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-lg">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md">
              {event.registration_type === 'team'
                ? `Team (${event.min_team_size}-${event.max_team_size} members)`
                : 'Individual Entry'}
            </span>
          </div>
        </div>

        {/* Header content overlay */}
        <div className="p-6 sm:p-8 -mt-24 sm:-mt-32 relative z-10 space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{event.start_time} - {event.end_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="truncate max-w-xs">{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Description, Rules, Organizer */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Event Overview</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Competition Rules & Guidelines</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {event.rules}
            </div>
          </div>

          {/* Organizer Info */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Organizers & Inquiries</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Organizing Committee</span>
                <span className="text-white font-semibold text-sm">{event.organizer_name}</span>
                <span className="text-slate-400 block text-[11px]">Nexus Institute of Technology</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Official Contact Email</span>
                <a
                  href={`mailto:${event.contact_email}`}
                  className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1.5 truncate"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>{event.contact_email}</span>
                </a>
                <span className="text-slate-400 block text-[11px]">Response time: within 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Registration Card Sticky */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-6 sticky top-24 shadow-xl">
            {/* Price & Status */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Registration Fee</span>
                <span className="text-2xl font-extrabold text-white">
                  {event.registration_fee > 0 ? `$${event.registration_fee}` : 'Free'}
                </span>
              </div>

              {isRegistered ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Registered
                </span>
              ) : isFull ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Capacity Full
                </span>
              ) : isExpired ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                  Registration Ended
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Active
                </span>
              )}
            </div>

            {/* Capacity Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Available Seats:</span>
                <span className="font-semibold text-white">
                  {available} of {max} remaining
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFull
                      ? 'bg-rose-500'
                      : available < 10
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((registered / max) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Key requirements list */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Format:</span>
                <span className="font-medium text-white capitalize">{event.registration_type}</span>
              </div>
              {event.registration_type === 'team' && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Team Size:</span>
                  <span className="font-medium text-white">
                    {event.min_team_size} - {event.max_team_size} members
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deadline:</span>
                <span className="font-medium text-white">{deadlineDate}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              {isRegistered ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Digital Pass</span>
                  </button>
                  <button
                    onClick={() => navigate('/student/registrations')}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors text-center"
                  >
                    Manage in My Registrations
                  </button>
                </div>
              ) : isFull ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
                  This event is fully booked. Check back if seats become available.
                </div>
              ) : isExpired ? (
                <div className="p-3 rounded-xl bg-slate-800 text-slate-400 text-xs text-center font-medium">
                  The registration deadline for this event has passed.
                </div>
              ) : isClosed ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center font-medium">
                  Registrations are currently closed by administrators.
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Log in to Register</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    New student?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-indigo-400 hover:underline font-medium"
                    >
                      Create account
                    </button>
                  </p>
                </div>
              ) : isStudent ? (
                <button
                  onClick={() => setShowRegModal(true)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register for Event</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs text-center">
                  Logged in as Administrator. To register, please use a student account.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegModal(false)}
          onSuccess={(_newReg) => {
            fetchEvent();
            onRefreshRegistrations();
          }}
          onNavigateToRegistrations={() => navigate('/student/registrations')}
        />
      )}

      {/* Ticket Modal */}
      {showTicketModal && registeredRegistration && (
        <TicketModal
          registration={registeredRegistration}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};
