import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, Lock, Mail, User, Building, Phone, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    college_name: 'Nexus Institute of Technology',
    department: 'Computer Science & Engineering',
    year_of_study: '3rd Year',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check the inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] mx-auto shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0E1322] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs text-slate-400">
            Join NexusTech to register for hackathons, workshops, and competitions
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1424] border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Alex Chen"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  University Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@nexustech.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                College / University Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college_name"
                  required
                  placeholder="e.g. Nexus Institute of Technology"
                  value={formData.college_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Department <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Year of Study <span className="text-red-400">*</span>
                </label>
                <select
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate / Master's">Postgraduate / Master&apos;s</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
