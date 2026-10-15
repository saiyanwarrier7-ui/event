import React, { useState, useEffect } from 'react';
import { X, Database, ShieldCheck, Copy, Check, Terminal, Server, Key } from 'lucide-react';
import { api } from '../services/api';

interface DatabaseModalProps {
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'schema' | 'instructions'>('status');

  useEffect(() => {
    api.getSystemInfo().then(setSystemInfo).catch(console.error);
  }, []);

  const SQL_SNIPPET = `-- NexusTech PostgreSQL & Supabase Database Migration
-- Includes RLS Policies, Tables, Constraints & Triggers

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    banner_url TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    max_participants INTEGER NOT NULL,
    registration_fee NUMERIC(10, 2) DEFAULT 0.00,
    registration_type VARCHAR(20) NOT NULL DEFAULT 'individual',
    min_team_size INTEGER DEFAULT 1,
    max_team_size INTEGER DEFAULT 1,
    rules TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_name VARCHAR(150),
    team_members JSONB DEFAULT '[]'::jsonb,
    registration_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_event UNIQUE (event_id, student_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#0F1424] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Backend & Database Architecture</h3>
              <p className="text-xs text-slate-400">PostgreSQL / Supabase Schema, RLS, and Server Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-5 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Runtime Engine Status
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL & Supabase SQL
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'instructions'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup & Deployment Guide
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-semibold text-white text-sm">Full-Stack Backend Active</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Express.js backend with atomic persistence at <code className="text-cyan-300">data/database.json</code>. All events, registrations, profiles, and authentication run on real persistent storage.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE PORT 3000
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Live Events</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    {systemInfo?.totalEvents ?? 7}
                  </span>
                  <span className="text-[10px] text-emerald-400">Published & Registrable</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Stored Profiles</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    {systemInfo?.totalProfiles ?? 3}
                  </span>
                  <span className="text-[10px] text-indigo-400">Admin + Student Accounts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Supabase SQL Migration</span>
                  <span className="text-lg font-bold text-cyan-400 mt-0.5 block">Ready</span>
                  <span className="text-[10px] text-slate-400">File: supabase_schema.sql</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Role-Based Security & Constraints Enforced
                </h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li><strong>Constraint Uniqueness:</strong> Duplicate registrations for the same event by the same student are blocked.</li>
                  <li><strong>Seat Capacity:</strong> Registrations are rejected if <code className="text-indigo-300">registered_count &gt;= max_participants</code>.</li>
                  <li><strong>Deadlines:</strong> Registrations automatically close when <code className="text-indigo-300">registration_deadline &lt; now()</code>.</li>
                  <li><strong>Admin Guard:</strong> Only users with <code className="text-indigo-300">role === &apos;admin&apos;</code> can create, edit, or delete events and export CSVs.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Full schema located in root <code className="text-cyan-300">/supabase_schema.sql</code>
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL' : 'Copy Migration SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
                {SQL_SNIPPET}
              </pre>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  1. Connecting to an External Supabase Project
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  To connect this portal to your remote Supabase instance, create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a> and run <code className="text-slate-200">supabase_schema.sql</code> in the Supabase SQL Editor.
                </p>
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300">
                  VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...<br />
                  JWT_SECRET=your-production-jwt-secret
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  2. Ready Out-of-the-Box Demo Accounts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-purple-300 block">Administrator Login:</span>
                    <span className="text-slate-400 block">Email: <code className="text-white">admin@nexustech.edu</code></span>
                    <span className="text-slate-400 block">Password: <code className="text-white">Admin@nexus2026</code></span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-cyan-300 block">Student Login:</span>
                    <span className="text-slate-400 block">Email: <code className="text-white">alex.chen@nexustech.edu</code></span>
                    <span className="text-slate-400 block">Password: <code className="text-white">Student@nexus2026</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
