import React from 'react';
import { TechnicalEvent, EventCategory } from '../types';
import { Calendar, Clock, MapPin, Users, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: TechnicalEvent;
  onSelect: (eventId: string) => void;
  onRegisterClick?: (event: TechnicalEvent) => void;
  isRegistered?: boolean;
}

const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Hackathons: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  'Coding Competitions': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
  },
  Robotics: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  Workshops: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  'Project Exhibitions': {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
  'Technical Quizzes': {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
  },
  'Paper Presentations': {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
  },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegisterClick,
  isRegistered = false,
}) => {
  const categoryStyle = CATEGORY_STYLES[event.category] || {
    bg: 'bg-slate-700/30',
    text: 'text-slate-300',
    border: 'border-slate-600',
  };

  const registered = event.registered_count || 0;
  const max = event.max_participants || 1;
  const fillPercent = Math.min(100, Math.round((registered / max) * 100));
  const isFull = event.is_full || registered >= max;
  const isExpired = event.is_expired || new Date() > new Date(event.registration_deadline);
  const isClosed = event.status === 'closed';
  const canRegister = !isFull && !isExpired && !isClosed && !isRegistered;

  const formattedDate = new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative bg-[#0E1424] hover:bg-[#12192e] rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.banner_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1424] via-transparent to-black/30"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {event.category}
          </span>
        </div>

        {/* Status indicator on banner */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isRegistered ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </span>
          ) : isFull ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
              <AlertCircle className="w-3.5 h-3.5" />
              Full
            </span>
          ) : isExpired ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-700/90 text-slate-200 backdrop-blur-md">
              Registration Closed
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-600/90 text-white backdrop-blur-md">
              Open
            </span>
          )}
        </div>

        {/* Team / Individual pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-black/60 text-slate-300 backdrop-blur-sm border border-white/10 flex items-center gap-1">
            {event.registration_type === 'team' ? (
              <>
                <Users className="w-3 h-3 text-cyan-400" />
                <span>Team ({event.min_team_size}-{event.max_team_size})</span>
              </>
            ) : (
              <>
                <User className="w-3 h-3 text-indigo-400" />
                <span>Individual</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3
          onClick={() => onSelect(event.id)}
          className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1 mb-2"
        >
          {event.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Meta details */}
        <div className="space-y-2 text-xs text-slate-300 mb-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{formattedDate}</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.start_time} - {event.end_time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Capacity & Seats</span>
            <span className={`font-medium ${isFull ? 'text-rose-400' : 'text-slate-300'}`}>
              {registered} / {max} filled ({fillPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-rose-500'
                  : fillPercent > 80
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
              }`}
              style={{ width: `${fillPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelect(event.id)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {canRegister && onRegisterClick && (
            <button
              onClick={() => onRegisterClick(event)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center gap-1"
            >
              <span>Register</span>
            </button>
          )}

          {isRegistered && (
            <button
              onClick={() => onSelect(event.id)}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
            >
              Pass Ready
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
