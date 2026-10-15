import React, { useState, useEffect } from 'react';
import { TechnicalEvent, EventCategory } from '../types';
import { api } from '../services/api';
import { EventCard } from '../components/EventCard';
import {
  Code,
  Cpu,
  Trophy,
  Zap,
  BookOpen,
  HelpCircle,
  Presentation,
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
  onRegisterEvent: (event: TechnicalEvent) => void;
  registeredEventIds: Set<string>;
}

const CATEGORIES: {
  name: EventCategory;
  icon: any;
  desc: string;
  gradient: string;
}[] = [
  {
    name: 'Hackathons',
    icon: Flame,
    desc: '36-hour intense innovation sprints and rapid prototyping.',
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    name: 'Coding Competitions',
    icon: Code,
    desc: 'Algorithmic mastery, data structures, and ICPC challenges.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    name: 'Robotics',
    icon: Cpu,
    desc: 'Autonomous rovers, combat bots, and mechatronic systems.',
    gradient: 'from-amber-600 to-orange-600',
  },
  {
    name: 'Workshops',
    icon: Zap,
    desc: 'Hands-on masterclasses on LLMs, cloud architecture, and embedded IoT.',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    name: 'Project Exhibitions',
    icon: Trophy,
    desc: 'Showcase hardware & software prototypes to angel investors.',
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    name: 'Paper Presentations',
    icon: Presentation,
    desc: 'Peer-reviewed research colloquium and academic presentations.',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    name: 'Technical Quizzes',
    icon: HelpCircle,
    desc: 'Fast-paced buzzer trivia on computer science and tech history.',
    gradient: 'from-rose-600 to-pink-600',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onSelectEvent,
  onRegisterEvent,
  registeredEventIds,
}) => {
  const [events, setEvents] = useState<TechnicalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvents()
      .then((res) => setEvents(res.events))
      .catch((err) => console.error('Failed to load events:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredEvents = events.slice(0, 3);
  const upcomingEvents = events.slice(3, 7);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/10 blur-[130px] -z-10 pointer-events-none rounded-full"></div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md animate-fade-in shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NexusTech Annual Engineering & Innovation Fest 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Discover. Innovate.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Compete.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The premier hub for university students to participate in exciting technical events,
            hackathons, robotics arenas, and hands-on developer masterclasses.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/events')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Register Now</span>
              <GraduationCap className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Key metrics ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#0E1324]/80 border border-slate-800 backdrop-blur-md">
              <span className="text-2xl lg:text-3xl font-extrabold text-white block">7+</span>
              <span className="text-xs text-slate-400 font-medium">Technical Tracks</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E1324]/80 border border-slate-800 backdrop-blur-md">
              <span className="text-2xl lg:text-3xl font-extrabold text-cyan-400 block">500+</span>
              <span className="text-xs text-slate-400 font-medium">Active Participants</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E1324]/80 border border-slate-800 backdrop-blur-md">
              <span className="text-2xl lg:text-3xl font-extrabold text-indigo-400 block">$25k+</span>
              <span className="text-xs text-slate-400 font-medium">Prizes & Grants</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E1324]/80 border border-slate-800 backdrop-blur-md">
              <span className="text-2xl lg:text-3xl font-extrabold text-purple-400 block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Verified Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Flagship Competitions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Technical Events
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Handpicked high-stakes challenges offering grand prizes, seed grants, and industry recognition.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                onRegisterClick={onRegisterEvent}
                isRegistered={registeredEventIds.has(evt.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Multi-Disciplinary Spectrum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Explore by Technical Categories
          </h2>
          <p className="text-sm text-slate-400">
            Find the right domain that matches your passion, from low-level robotics to cutting-edge AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/events?category=${encodeURIComponent(cat.name)}`)}
                className="group p-5 rounded-2xl bg-[#0D1322] hover:bg-[#12192e] border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.gradient} p-0.5 mb-4 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-400">
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>Next on Schedule</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Upcoming Events Schedule
              </h2>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>See Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                onRegisterClick={onRegisterEvent}
                isRegistered={registeredEventIds.has(evt.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* About & Campus Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#0E1426] to-purple-950/30 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                About NexusTech Events
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Empowering the Next Generation of Engineers & Builders
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                NexusTech connects ambitious university students across departments with competitive
                arenas, industry sponsors, and technical mentors. We foster hands-on learning, teamwork,
                and groundbreaking innovations that leap beyond the classroom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Instant Seat Tracking</h4>
                    <p className="text-[11px] text-slate-400">Live seat capacity & zero overbooking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Team Collaboration</h4>
                    <p className="text-[11px] text-slate-400">Register squads with automated rosters.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Admin Management</h4>
                    <p className="text-[11px] text-slate-400">Live analytics, CSV exports & control.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Verified Digital Passes</h4>
                    <p className="text-[11px] text-slate-400">Unique check-in passes & digital badges.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                  alt="Students collaborating at hackathon"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block p-4 rounded-xl bg-[#0F1422] border border-indigo-500/30 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Official University Portal</span>
                    <span className="text-[10px] text-slate-400">Accredited by Faculty Technical Board</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-12 text-center relative overflow-hidden border border-indigo-500/30 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Showcase Your Technical Prowess?
            </h2>
            <p className="text-sm sm:text-base text-indigo-200">
              Join thousands of students competing in high-impact college events. Create your student
              account in less than 60 seconds and reserve your spots today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all"
              >
                Create Student Account
              </button>
              <button
                onClick={() => navigate('/events')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                Browse All Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
