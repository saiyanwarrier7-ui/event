import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
  defaultRole?: 'student' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, defaultRole = 'student' }) => {
  const { login } = useAuth();
  const [roleTab, setRoleTab] = useState<'student' | 'admin'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setRoleTab('admin');
      setEmail('admin@nexustech.edu');
      setPassword('Admin@nexus2026');
    } else {
      setRoleTab('student');
      setEmail('alex.chen@nexustech.edu');
      setPassword('Student@nexus2026');
    }
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-[1.5px] mx-auto shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0E1322] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to NexusTech
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your technical events portal
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 shadow-2xl space-y-6">
          {/* Role selector tab */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                roleTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('admin');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                roleTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={roleTab === 'admin' ? 'admin@nexustech.edu' : 'student@nexustech.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                roleTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-600/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {roleTab === 'admin' ? 'Administrator' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo fast testing autofill buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block text-center font-medium">
              Demo Credentials (1-Click Test)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="py-1.5 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-center transition-colors truncate"
              >
                Autofill Student
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="py-1.5 px-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-center transition-colors truncate"
              >
                Autofill Admin
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Create student account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
