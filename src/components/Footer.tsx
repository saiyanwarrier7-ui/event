import React from 'react';
import { Cpu, Mail, MapPin, Phone, Github, Twitter, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-[#070A11] border-t border-slate-800/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Nexus<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tech</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier technical event and competitive programming platform for university students. Discover, collaborate, and compete in world-class hackathons, robotics challenges, and research symposiums.
            </p>

            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a href="#github" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#twitter" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#linkedin" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">Event Tracks</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/events?category=Hackathons')} className="hover:text-indigo-400 transition-colors">
                  Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events?category=Coding%20Competitions')} className="hover:text-indigo-400 transition-colors">
                  Coding Competitions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events?category=Robotics')} className="hover:text-indigo-400 transition-colors">
                  Robotics Arenas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events?category=Workshops')} className="hover:text-indigo-400 transition-colors">
                  Hands-on Workshops
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events?category=Project%20Exhibitions')} className="hover:text-indigo-400 transition-colors">
                  Project Exhibitions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events?category=Technical%20Quizzes')} className="hover:text-indigo-400 transition-colors">
                  Technical Quizzes
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-indigo-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-indigo-400 transition-colors">
                  All Events
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/register')} className="hover:text-indigo-400 transition-colors">
                  Student Registration
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-indigo-400 transition-colors">
                  Student Sign In
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/login')} className="hover:text-purple-400 transition-colors">
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">Campus Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Department of CSE, Nexus Institute, Innovation Quad 402</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:events@nexustech.edu" className="hover:text-white transition-colors">events@nexustech.edu</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexusTech University Portal. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Engineered with precision for college innovators</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
