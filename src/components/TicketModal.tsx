import React from 'react';
import { Registration } from '../types';
import { X, Calendar, Clock, MapPin, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface TicketModalProps {
  registration: Registration;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ registration, onClose }) => {
  const { event, student } = registration;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Pass Top Bar */}
        <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900 p-5 flex items-start justify-between border-b border-indigo-500/30">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Event Pass</span>
            </div>
            <h3 className="text-lg font-bold text-white">{event?.title || 'Technical Event'}</h3>
            <p className="text-xs text-indigo-200">Nexus Institute of Technology</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-5">
          {/* Status & ID */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registration ID</span>
              <span className="font-mono text-sm font-bold text-cyan-400">{registration.id.toUpperCase()}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                registration.registration_status === 'confirmed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : registration.registration_status === 'cancelled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {registration.registration_status}
            </span>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Participant</span>
              <span className="font-semibold text-white block mt-0.5">{student?.full_name}</span>
              <span className="text-slate-400 text-[11px] block">{student?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Department</span>
              <span className="font-semibold text-white block mt-0.5">{student?.department}</span>
              <span className="text-slate-400 text-[11px] block">{student?.year_of_study}</span>
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event?.event_date ? new Date(event.event_date + 'T00:00:00').toLocaleDateString() : 'TBA'}</span>
              <span className="text-slate-600">•</span>
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event?.start_time} - {event?.end_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event?.venue}</span>
            </div>
          </div>

          {/* Team Info if present */}
          {registration.team_name && (
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
              <span className="text-[10px] text-indigo-300 uppercase font-semibold block">Team Details</span>
              <p className="font-bold text-white text-sm mt-0.5">{registration.team_name}</p>
              {registration.team_members && registration.team_members.length > 0 && (
                <div className="mt-2 pt-2 border-t border-indigo-500/20 space-y-1">
                  <span className="text-[11px] text-slate-400 block">Squad Roster:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                    <span className="text-indigo-200">1. {student?.full_name} (Lead)</span>
                    {registration.team_members.map((m, idx) => (
                      <span key={idx} className="truncate">
                        {idx + 2}. {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QR Code and Verification preview */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-white">Check-in Verification</span>
              <p className="text-[11px] text-slate-400 max-w-[240px]">
                Scan at the venue entrance. Valid for admission of all registered team members.
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
