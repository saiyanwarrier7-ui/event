import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DatabaseModal } from './components/DatabaseModal';
import { RegistrationModal } from './components/RegistrationModal';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminEventFormPage } from './pages/admin/AdminEventFormPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { TechnicalEvent, Registration } from './types';
import { api } from './services/api';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading, isAuthenticated, isAdmin, isStudent } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [quickRegisterEvent, setQuickRegisterEvent] = useState<TechnicalEvent | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);

  // Navigation helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch student's registrations if logged in
  const loadUserRegistrations = async () => {
    if (isAuthenticated && !isAdmin) {
      try {
        const res = await api.getMyRegistrations();
        setMyRegistrations(res.registrations);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    } else {
      setMyRegistrations([]);
    }
  };

  useEffect(() => {
    loadUserRegistrations();
  }, [isAuthenticated, isAdmin]);

  const registeredEventIds = new Set(
    myRegistrations
      .filter((r) => r.registration_status !== 'cancelled')
      .map((r) => r.event_id)
  );

  const handleRegisterClick = (event: TechnicalEvent) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      alert('You are currently signed in as an administrator. Please log in as a student to register.');
    } else {
      setQuickRegisterEvent(event);
    }
  };

  // Route parsing
  const renderCurrentPage = () => {
    if (authLoading) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    // Single event detail route: /events/:id
    const eventDetailMatch = currentPath.match(/^\/events\/([a-zA-Z0-9_-]+)$/);
    if (eventDetailMatch) {
      const eventId = eventDetailMatch[1];
      const existingReg = myRegistrations.find(
        (r) => r.event_id === eventId && r.registration_status !== 'cancelled'
      );
      return (
        <EventDetailPage
          eventId={eventId}
          navigate={navigate}
          onBack={() => navigate('/events')}
          registeredRegistration={existingReg}
          onRefreshRegistrations={loadUserRegistrations}
        />
      );
    }

    // Admin edit route: /admin/events/:id/edit
    const adminEditMatch = currentPath.match(/^\/admin\/events\/([a-zA-Z0-9_-]+)\/edit$/);
    if (adminEditMatch) {
      if (!isAdmin) return renderAccessDenied();
      return <AdminEventFormPage eventId={adminEditMatch[1]} navigate={navigate} />;
    }

    // Admin registrations per event: /admin/events/:id/registrations
    const adminRegMatch = currentPath.match(/^\/admin\/events\/([a-zA-Z0-9_-]+)\/registrations$/);
    if (adminRegMatch) {
      if (!isAdmin) return renderAccessDenied();
      return <AdminRegistrationsPage eventId={adminRegMatch[1]} navigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return (
          <HomePage
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
            onRegisterEvent={handleRegisterClick}
            registeredEventIds={registeredEventIds}
          />
        );

      case '/events':
        return (
          <EventsPage
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
            onRegisterEvent={handleRegisterClick}
            registeredEventIds={registeredEventIds}
          />
        );

      case '/login':
        return <LoginPage navigate={navigate} defaultRole="student" />;

      case '/admin/login':
        return <LoginPage navigate={navigate} defaultRole="admin" />;

      case '/register':
        return <RegisterPage navigate={navigate} />;

      // Student Protected Routes
      case '/student/dashboard':
        if (!isAuthenticated) return renderLoginRequired();
        if (isAdmin) {
          navigate('/admin/dashboard');
          return null;
        }
        return (
          <StudentDashboard
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
          />
        );

      case '/student/registrations':
        if (!isAuthenticated) return renderLoginRequired();
        if (isAdmin) {
          navigate('/admin/dashboard');
          return null;
        }
        return (
          <MyRegistrationsPage
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
          />
        );

      case '/student/profile':
        if (!isAuthenticated) return renderLoginRequired();
        return <StudentProfilePage />;

      // Admin Protected Routes
      case '/admin':
      case '/admin/dashboard':
        if (!isAdmin) return renderAccessDenied();
        return (
          <AdminDashboard
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
          />
        );

      case '/admin/events':
        if (!isAdmin) return renderAccessDenied();
        return (
          <AdminEventsPage
            navigate={navigate}
            onSelectEvent={(id) => navigate(`/events/${id}`)}
          />
        );

      case '/admin/events/create':
        if (!isAdmin) return renderAccessDenied();
        return <AdminEventFormPage navigate={navigate} />;

      case '/admin/students':
        if (!isAdmin) return renderAccessDenied();
        return <AdminStudentsPage navigate={navigate} />;

      default:
        return (
          <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
            <h2 className="text-3xl font-extrabold text-white">404 - Page Not Found</h2>
            <p className="text-xs text-slate-400">
              The page you are looking for does not exist or has moved.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  const renderAccessDenied = () => (
    <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
      <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">Access Denied</h2>
      <p className="text-xs text-slate-400">
        Administrator privileges are required to access this portal page. Students cannot view or modify administrative configurations.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Return Home
        </button>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
        >
          Sign In as Admin
        </button>
      </div>
    </div>
  );

  const renderLoginRequired = () => (
    <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">Authentication Required</h2>
      <p className="text-xs text-slate-400">
        Please sign in with your student account to access your personal registrations and dashboard.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        openDatabaseModal={() => setDbModalOpen(true)}
      />

      <main className="flex-1">{renderCurrentPage()}</main>

      <Footer navigate={navigate} />

      {/* Database & Supabase inspect modal */}
      {dbModalOpen && <DatabaseModal onClose={() => setDbModalOpen(false)} />}

      {/* Quick Registration Modal from cards */}
      {quickRegisterEvent && (
        <RegistrationModal
          event={quickRegisterEvent}
          onClose={() => setQuickRegisterEvent(null)}
          onSuccess={(_reg) => {
            loadUserRegistrations();
          }}
          onNavigateToRegistrations={() => navigate('/student/registrations')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
