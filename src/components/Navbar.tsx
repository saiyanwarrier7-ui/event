import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  Calendar,
  Layers,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Database,
  Ticket,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openDatabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openDatabaseModal }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">Nexus<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tech</span></span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Portal</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">Technical Events Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/events')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Explore Events
            </button>

            {isAuthenticated && !isAdmin && (
              <>
                <button
                  onClick={() => handleNav('/student/dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/dashboard')
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('/student/registrations')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/student/registrations')
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  My Registrations
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNav('/admin/dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'text-white bg-purple-900/40 border border-purple-500/30'
                      : 'text-purple-300 hover:text-white hover:bg-purple-900/20'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Admin Console
                </button>
                <button
                  onClick={() => handleNav('/admin/events')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/events')
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Manage Events
                </button>
                <button
                  onClick={() => handleNav('/admin/students')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/students')
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Students
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Database / Supabase inspect button */}
            <button
              onClick={openDatabaseModal}
              title="Inspect Database Schema & Supabase Setup"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-300 hover:text-cyan-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>DB / SQL</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isAdmin
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                  }`}>
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
                      {user?.full_name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0F1422] border border-slate-700 shadow-2xl py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-medium text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user?.college_name || 'Nexus Institute'}
                      </span>
                    </div>

                    {!isAdmin && (
                      <>
                        <button
                          onClick={() => handleNav('/student/dashboard')}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          Dashboard
                        </button>
                        <button
                          onClick={() => handleNav('/student/registrations')}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                        >
                          <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                          My Registrations
                        </button>
                        <button
                          onClick={() => handleNav('/student/profile')}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          My Profile
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleNav('/admin/dashboard')}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          Admin Console
                        </button>
                        <button
                          onClick={() => handleNav('/admin/events')}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          All Events
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-md shadow-indigo-500/25 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openDatabaseModal}
              className="p-1.5 text-slate-400 hover:text-cyan-400"
              title="Database Info"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D121F] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/')}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/events')}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Explore Events
            </button>

            {isAuthenticated && !isAdmin && (
              <>
                <button
                  onClick={() => handleNav('/student/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('/student/registrations')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  My Registrations
                </button>
                <button
                  onClick={() => handleNav('/student/profile')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  My Profile
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNav('/admin/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-purple-300 hover:text-white hover:bg-purple-900/30 rounded-lg"
                >
                  Admin Overview
                </button>
                <button
                  onClick={() => handleNav('/admin/events')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Manage Events
                </button>
                <button
                  onClick={() => handleNav('/admin/students')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Student Directory
                </button>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-lg bg-slate-800/40">
                  <p className="text-xs text-white font-medium">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-sm text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="py-2 text-center text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="py-2 text-center text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
