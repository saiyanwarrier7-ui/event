export type Role = 'student' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  college_name: string;
  department: string;
  year_of_study: string;
  phone: string;
  role: Role;
  created_at: string;
}

export type EventCategory =
  | 'Hackathons'
  | 'Coding Competitions'
  | 'Paper Presentations'
  | 'Project Exhibitions'
  | 'Robotics'
  | 'Workshops'
  | 'Technical Quizzes';

export type EventStatus = 'draft' | 'published' | 'closed';
export type RegistrationType = 'individual' | 'team';
export type RegistrationStatus = 'confirmed' | 'pending' | 'cancelled' | 'rejected';

export interface TeamMember {
  name: string;
  email: string;
  college?: string;
  phone?: string;
  department?: string;
  year?: string;
}

export interface TechnicalEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  banner_url: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  organizer_name: string;
  contact_email: string;
  registration_deadline: string;
  max_participants: number;
  registration_fee: number;
  registration_type: RegistrationType;
  min_team_size: number;
  max_team_size: number;
  rules: string;
  status: EventStatus;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  registered_count?: number;
  available_seats?: number;
  is_full?: boolean;
  is_expired?: boolean;
}

export interface Registration {
  id: string;
  event_id: string;
  student_id: string;
  team_name?: string | null;
  team_members: TeamMember[];
  registration_status: RegistrationStatus;
  registered_at: string;
  event?: TechnicalEvent;
  student?: UserProfile;
}

export interface AdminEventStat {
  id: string;
  title: string;
  category: EventCategory;
  event_date: string;
  max_participants: number;
  registered_count: number;
  available_seats: number;
  fill_percentage: number;
  status: EventStatus;
}

export interface AdminStats {
  totalEvents: number;
  publishedEvents: number;
  totalStudents: number;
  totalRegistrations: number;
  upcomingEvents: number;
  categoryCounts: Record<string, number>;
  eventStats: AdminEventStat[];
  recentRegistrations: Registration[];
}

export interface StudentListItem extends UserProfile {
  total_registrations: number;
  active_registrations: number;
}
