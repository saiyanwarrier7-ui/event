import React, { useState, useEffect } from 'react';
import { TechnicalEvent, EventCategory, EventStatus, RegistrationType } from '../../types';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Image as ImageIcon,
  Mail,
  FileText,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
} from 'lucide-react';

interface AdminEventFormPageProps {
  eventId?: string; // If provided, edit mode
  navigate: (path: string) => void;
}

const CATEGORIES: EventCategory[] = [
  'Hackathons',
  'Coding Competitions',
  'Robotics',
  'Workshops',
  'Project Exhibitions',
  'Paper Presentations',
  'Technical Quizzes',
];

export const AdminEventFormPage: React.FC<AdminEventFormPageProps> = ({
  eventId,
  navigate,
}) => {
  const isEdit = Boolean(eventId);

  const [formData, setFormData] = useState<Partial<TechnicalEvent>>({
    title: '',
    description: '',
    category: 'Hackathons',
    banner_url:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    event_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '17:00',
    venue: 'Nexus Main Auditorium & Innovation Arena, Block A',
    organizer_name: 'Nexus ACM Student Chapter',
    contact_email: 'events@nexustech.edu',
    registration_deadline: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 16),
    max_participants: 60,
    registration_fee: 0,
    registration_type: 'team',
    min_team_size: 2,
    max_team_size: 4,
    rules:
      '1. Teams must comprise eligible university students.\n2. All code, design, and models must be constructed during the event.\n3. Third-party APIs and open-source models are permitted with disclosure.\n4. Decisions of the technical evaluation panel are final.',
    status: 'published',
  });

  const [presets, setPresets] = useState<{ title: string; category: string; url: string }[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    // Load presets
    api.getBannerPresets().then((res) => setPresets(res.presets)).catch(console.error);

    // If edit mode, load event
    if (eventId) {
      api
        .getEventById(eventId)
        .then((res) => {
          const e = res.event;
          setFormData({
            ...e,
            registration_deadline: new Date(e.registration_deadline).toISOString().slice(0, 16),
          });
        })
        .catch((err) => setError(err.message || 'Failed to load event'))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const res = await api.uploadBanner(file);
      setFormData((prev) => ({ ...prev, banner_url: res.url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image banner.');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validations
    if (!formData.title?.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Event description is required.');
      return;
    }
    if (!formData.venue?.trim()) {
      setError('Event venue is required.');
      return;
    }
    if (!formData.max_participants || formData.max_participants <= 0) {
      setError('Maximum participants must be at least 1.');
      return;
    }
    if (formData.registration_type === 'team') {
      if ((formData.min_team_size || 1) > (formData.max_team_size || 1)) {
        setError('Minimum team size cannot be greater than maximum team size.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        registration_deadline: new Date(formData.registration_deadline!).toISOString(),
      };

      if (isEdit) {
        await api.updateEvent(eventId!, payload);
      } else {
        await api.createEvent(payload);
      }

      navigate('/admin/events');
    } catch (err: any) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/events')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events Management</span>
        </button>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {isEdit ? 'Edit Mode' : 'Create Mode'}
        </span>
      </div>

      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isEdit ? 'Edit Technical Event' : 'Create New Technical Event'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specify competition guidelines, timeline, seat quotas, and banner aesthetics.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>General Information</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. HackMatrix 2026: 36-Hour National AI Hackathon"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category Track <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Publication Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="published">Published (Visible & Open for Registration)</option>
                <option value="draft">Draft (Hidden from students)</option>
                <option value="closed">Closed (Visible but registration blocked)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Provide a comprehensive summary of the event objectives, challenges, and highlights..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Section 2: Banner Selection & Upload */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Event Banner & Artwork</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Preview */}
            <div className="w-full sm:w-64 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative group">
              <img
                src={formData.banner_url}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                Active Preview
              </span>
            </div>

            {/* Input & Upload */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="banner_url"
                  required
                  placeholder="https://..."
                  value={formData.banner_url}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Or Choose from Curated Presets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, banner_url: p.url }))}
                      className={`p-1.5 rounded-lg border text-left transition-all ${
                        formData.banner_url === p.url
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={p.url} alt="" className="w-full h-12 object-cover rounded mb-1" />
                      <span className="text-[10px] text-slate-300 truncate block">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Schedule, Venue & Logistics */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Date, Time & Venue</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="event_date"
                required
                value={formData.event_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                End Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Venue Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                required
                placeholder="e.g. Turing Computer Labs / Main Auditorium"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Registration Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="registration_deadline"
                required
                value={formData.registration_deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organizer / Department Name
              </label>
              <input
                type="text"
                name="organizer_name"
                placeholder="e.g. Nexus ACM Chapter & AI Lab"
                value={formData.organizer_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organizer Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                placeholder="organizer@nexustech.edu"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Registration Constraints & Team Config */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Capacity, Fees & Team Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Maximum Seats / Participants <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={500}
                name="max_participants"
                required
                value={formData.max_participants}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Registration Fee ($ USD)
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Format Type
              </label>
              <select
                name="registration_type"
                value={formData.registration_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="individual">Individual Participation</option>
                <option value="team">Team Participation</option>
              </select>
            </div>
          </div>

          {formData.registration_type === 'team' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Minimum Team Size (incl. leader)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  name="min_team_size"
                  value={formData.min_team_size}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Maximum Team Size
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  name="max_team_size"
                  value={formData.max_team_size}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Rules & Evaluation Guidelines <span className="text-red-400">*</span>
            </label>
            <textarea
              name="rules"
              rows={4}
              required
              placeholder="List the rules, code of conduct, permitted tools, and judging criteria..."
              value={formData.rules}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving Event...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEdit ? 'Update Event Changes' : 'Create & Publish Event'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
