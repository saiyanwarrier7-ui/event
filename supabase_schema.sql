-- ==============================================================================
-- NexusTech - Technical Event Registration Website Schema
-- PostgreSQL & Supabase Database Migration
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Extends Supabase auth.users or standalone auth)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. Events Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'Hackathons',
        'Coding Competitions',
        'Paper Presentations',
        'Project Exhibitions',
        'Robotics',
        'Workshops',
        'Technical Quizzes'
    )),
    banner_url TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    registration_fee NUMERIC(10, 2) DEFAULT 0.00,
    registration_type VARCHAR(20) NOT NULL DEFAULT 'individual' CHECK (registration_type IN ('individual', 'team')),
    min_team_size INTEGER DEFAULT 1 CHECK (min_team_size >= 1),
    max_team_size INTEGER DEFAULT 1 CHECK (max_team_size >= 1),
    rules TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. Registrations Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_name VARCHAR(150),
    team_members JSONB DEFAULT '[]'::jsonb,
    registration_status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (
        registration_status IN ('confirmed', 'pending', 'cancelled', 'rejected')
    ),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_event UNIQUE (event_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 4. Indexes for Performance
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON public.registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(registration_status);

-- ------------------------------------------------------------------------------
-- 5. Trigger for updated_at on events
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_events_updated_at ON public.events;
CREATE TRIGGER trigger_update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. Supabase Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Events Policies
CREATE POLICY "Public can view published events"
ON public.events FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update events"
ON public.events FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete events"
ON public.events FOR DELETE
TO authenticated
USING (public.is_admin());

-- Registrations Policies
CREATE POLICY "Students can view their own registrations"
ON public.registrations FOR SELECT
TO authenticated
USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can register for open events"
ON public.registrations FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
        SELECT 1 FROM public.events
        WHERE id = event_id
          AND status = 'published'
          AND registration_deadline > timezone('utc'::text, now())
          AND (
            SELECT COUNT(*) FROM public.registrations
            WHERE event_id = events.id AND registration_status = 'confirmed'
          ) < max_participants
    )
);

CREATE POLICY "Students can cancel their own registrations"
ON public.registrations FOR UPDATE
TO authenticated
USING (auth.uid() = student_id OR public.is_admin())
WITH CHECK (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Admins can delete registrations"
ON public.registrations FOR DELETE
TO authenticated
USING (public.is_admin());
