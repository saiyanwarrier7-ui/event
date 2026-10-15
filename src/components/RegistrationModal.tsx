import React, { useState } from 'react';
import { TechnicalEvent, TeamMember, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  Users,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Printer,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface RegistrationModalProps {
  event: TechnicalEvent;
  onClose: () => void;
  onSuccess: (reg: Registration) => void;
  onNavigateToRegistrations: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onSuccess,
  onNavigateToRegistrations,
}) => {
  const { user } = useAuth();
  const isTeam = event.registration_type === 'team';

  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedReg, setConfirmedReg] = useState<Registration | null>(null);

  // Maximum additional members we can add
  // total team size = 1 (leader) + teamMembers.length
  const maxAdditional = Math.max(0, event.max_team_size - 1);
  const minRequiredMembers = Math.max(0, event.min_team_size - 1);

  const handleAddMember = () => {
    if (teamMembers.length < maxAdditional) {
      setTeamMembers([
        ...teamMembers,
        { name: '', email: '', department: '', year: '3rd Year', phone: '' },
      ]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isTeam) {
      if (!teamName.trim()) {
        setError('Please provide a team name.');
        return;
      }

      const totalSize = 1 + teamMembers.length;
      if (totalSize < event.min_team_size) {
        setError(
          `This event requires at least ${event.min_team_size} members. Please add ${
            event.min_team_size - totalSize
          } more member(s).`
        );
        return;
      }

      // Check member completeness
      for (let i = 0; i < teamMembers.length; i++) {
        const m = teamMembers[i];
        if (!m.name.trim() || !m.email.trim()) {
          setError(`Please fill in at least the name and email for Member #${i + 2}.`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await api.registerForEvent({
        event_id: event.id,
        team_name: isTeam ? teamName.trim() : undefined,
        team_members: isTeam ? teamMembers : [],
      });
      setConfirmedReg(res.registration);
      onSuccess(res.registration);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 to-indigo-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {event.category}
              </span>
              <span className="text-xs text-slate-400">
                {event.registration_type === 'team' ? 'Team Registration' : 'Individual Registration'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {confirmedReg ? (
          <div className="p-6 space-y-6">
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Registration Confirmed!</h3>
              <p className="text-sm text-slate-300 mt-1">
                Your spot has been successfully secured. We look forward to seeing you at the event!
              </p>
            </div>

            {/* Digital Pass / Ticket Card */}
            <div
              id="registration-pass"
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-[#0D1326] to-purple-950/60 border border-indigo-500/40 relative shadow-xl"
            >
              <div className="flex justify-between items-start border-b border-indigo-500/20 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    Official Event Pass
                  </span>
                  <h4 className="font-bold text-white text-base mt-0.5">{event.title}</h4>
                  <p className="text-xs text-slate-300">Nexus Institute of Technology</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">PASS ID</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {confirmedReg.id.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Participant</span>
                  <span className="text-white font-medium">{user?.full_name}</span>
                  <span className="text-slate-400 block text-[10px]">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department & Year</span>
                  <span className="text-white font-medium">
                    {user?.department} • {user?.year_of_study}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Time</span>
                  <span className="text-white font-medium">
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString()}
                  </span>
                  <span className="text-slate-400 block text-[10px]">
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Venue</span>
                  <span className="text-white font-medium">{event.venue}</span>
                </div>
              </div>

              {confirmedReg.team_name && (
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block">Team Registered:</span>
                  <span className="text-indigo-300 font-semibold">{confirmedReg.team_name}</span>
                  {confirmedReg.team_members && confirmedReg.team_members.length > 0 && (
                    <div className="mt-1 text-[11px] text-slate-400">
                      Co-members: {confirmedReg.team_members.map((m) => m.name).join(', ')}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Status: Confirmed & Active
                </span>
                <span>Present this pass or digital ID at check-in</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRegistrations();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View My Registrations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Event Key Details Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
                  <span className="text-white font-medium">
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Time</span>
                  <span className="text-white font-medium">
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Venue</span>
                  <span className="text-white font-medium truncate">{event.venue}</span>
                </div>
              </div>
            </div>

            {/* Primary Student Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Primary Registrant Info (You)
                </h4>
                <span className="text-[11px] text-slate-400">Auto-filled from profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Full Name</span>
                  <span className="text-white font-medium">{user?.full_name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Email Address</span>
                  <span className="text-white font-medium truncate">{user?.email}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">College</span>
                  <span className="text-white font-medium">{user?.college_name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Department & Year</span>
                  <span className="text-white font-medium">
                    {user?.department} • {user?.year_of_study}
                  </span>
                </div>
              </div>
            </div>

            {/* Team Specific Section */}
            {isTeam && (
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    Team Information
                  </h4>
                  <span className="text-[11px] text-cyan-400">
                    Required: {event.min_team_size} to {event.max_team_size} members
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Quantum Pioneers, CodeCrafters"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Co-members ({teamMembers.length} added, total squad: {teamMembers.length + 1})
                    </span>

                    {teamMembers.length < maxAdditional && (
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    )}
                  </div>

                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-indigo-300">
                          Member #{index + 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          required
                          placeholder="Member Full Name *"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Member Email *"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Department (e.g. CSE)"
                          value={member.department || ''}
                          onChange={(e) =>
                            handleMemberChange(index, 'department', e.target.value)
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={member.phone || ''}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}

                  {teamMembers.length < minRequiredMembers && (
                    <p className="text-[11px] text-amber-400">
                      * You must add at least {minRequiredMembers - teamMembers.length} more member(s) to
                      meet the minimum requirement of {event.min_team_size}.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Rules reminder */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Registration Agreement:</span>
              <p>
                By registering, you confirm that all provided details are accurate and agree to follow
                all official event rules, safety protocols, and university code of conduct.
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Confirm & Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
