import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  college_name: string;
  department: string;
  year_of_study: string;
  phone: string;
  role: 'student' | 'admin';
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
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Dynamic fields computed for responses:
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
  // Joined fields
  event?: TechnicalEvent;
  student?: Omit<Profile, 'password_hash'>;
}

interface DatabaseSchema {
  profiles: Profile[];
  events: TechnicalEvent[];
  registrations: Registration[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

class Database {
  private data: DatabaseSchema = {
    profiles: [],
    events: [],
    registrations: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        return;
      } catch (err) {
        console.error('Failed to parse database.json, re-seeding default database:', err);
      }
    }

    this.seedDefaultData();
    this.save();
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private seedDefaultData() {
    const adminHash = bcrypt.hashSync('Admin@nexus2026', 10);
    const studentHash = bcrypt.hashSync('Student@nexus2026', 10);

    const adminProfile: Profile = {
      id: 'admin-0001-uuid-0001',
      full_name: 'Dr. Sarah Vance',
      email: 'admin@nexustech.edu',
      password_hash: adminHash,
      college_name: 'Nexus Institute of Technology',
      department: 'Computer Science & Engineering',
      year_of_study: 'Faculty / Admin',
      phone: '+1 555-019-2834',
      role: 'admin',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    };

    const studentProfile: Profile = {
      id: 'student-0001-uuid-0001',
      full_name: 'Alex Chen',
      email: 'alex.chen@nexustech.edu',
      password_hash: studentHash,
      college_name: 'Nexus Institute of Technology',
      department: 'Computer Science',
      year_of_study: '3rd Year',
      phone: '+1 555-234-8901',
      role: 'student',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    };

    const studentProfile2: Profile = {
      id: 'student-0002-uuid-0002',
      full_name: 'Priya Sharma',
      email: 'priya.sharma@nexustech.edu',
      password_hash: studentHash,
      college_name: 'Nexus Institute of Technology',
      department: 'Electronics & Communication',
      year_of_study: '4th Year',
      phone: '+1 555-345-6789',
      role: 'student',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    };

    const initialEvents: TechnicalEvent[] = [
      {
        id: 'evt-001',
        title: 'HackMatrix 2026: 36-Hour National AI Hackathon',
        description:
          'Assemble your elite engineering squad for an intense 36-hour sprint. Tackle real-world challenges in Generative AI, Autonomous Systems, and Sustainable Computing with industry mentorship, hardware sandboxes, and $15,000 in grand prizes.',
        category: 'Hackathons',
        banner_url:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-20',
        start_time: '09:00',
        end_time: '21:00',
        venue: 'Nexus Main Auditorium & Innovation Arena, Block A',
        organizer_name: 'Nexus ACM Student Chapter & AI Lab',
        contact_email: 'hackmatrix@nexustech.edu',
        registration_deadline: '2026-11-15T23:59:59.000Z',
        max_participants: 60,
        registration_fee: 0,
        registration_type: 'team',
        min_team_size: 2,
        max_team_size: 4,
        rules:
          '1. Teams must comprise 2-4 eligible university students.\n2. All code, design, and models must be constructed during the hackathon period.\n3. Third-party APIs and open-source models are permitted with disclosure.\n4. Original repository commit logs will be verified.\n5. Decisions of the technical evaluation panel are final.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: 'evt-002',
        title: 'ByteCode Collegiate: Grand Algorithmic Contest',
        description:
          'Speed, precision, and algorithmic mastery. Solve 8 mind-bending problems spanning dynamic programming, graph theory, combinatorics, and computational geometry under strict ACM-ICPC style rules and live scoreboard.',
        category: 'Coding Competitions',
        banner_url:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-05',
        start_time: '14:00',
        end_time: '18:00',
        venue: 'Turing Computer Center Labs 1 & 2',
        organizer_name: 'Department of Computing & IEEE CS',
        contact_email: 'bytecode@nexustech.edu',
        registration_deadline: '2026-11-03T23:59:59.000Z',
        max_participants: 80,
        registration_fee: 0,
        registration_type: 'individual',
        min_team_size: 1,
        max_team_size: 1,
        rules:
          '1. Individual participation only.\n2. Languages supported: C++, Java, Python3, Rust, Go.\n3. Standard ICPC penalty rules for incorrect submissions.\n4. No external internet browsing during the active contest window.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      },
      {
        id: 'evt-003',
        title: 'RoboWars: Steel Arena Championship',
        description:
          'Watch custom engineered combat bots clash in our bulletproof reinforced polycarbonate arena. Categories include 15kg featherweight and 30kg middleweight autonomous & RC combat robots.',
        category: 'Robotics',
        banner_url:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-28',
        start_time: '10:00',
        end_time: '17:30',
        venue: 'Outdoor Amphitheater & Robotics Yard',
        organizer_name: 'Nexus Robotics Society & Mechatronics Dept',
        contact_email: 'robowars@nexustech.edu',
        registration_deadline: '2026-11-22T23:59:59.000Z',
        max_participants: 24,
        registration_fee: 0,
        registration_type: 'team',
        min_team_size: 2,
        max_team_size: 5,
        rules:
          '1. Robots must conform strictly to weight and weapon safety regulations.\n2. Failsafe switch and active radio transmitter lock required.\n3. Flame or projectile weapons are strictly prohibited.\n4. Double elimination bracket rounds.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: 'evt-004',
        title: 'Building Production LLM Agents & Microservices',
        description:
          'A hands-on, high-impact masterclass on building robust agentic pipelines, vector search with embeddings, function-calling frameworks, and deploying low-latency model APIs with containerized microservices.',
        category: 'Workshops',
        banner_url:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-10-30',
        start_time: '13:00',
        end_time: '17:00',
        venue: 'Seminar Hall 3 & Virtual Cloud Workspace',
        organizer_name: 'Nexus Cloud & Distributed Systems Club',
        contact_email: 'workshops@nexustech.edu',
        registration_deadline: '2026-10-28T23:59:59.000Z',
        max_participants: 50,
        registration_fee: 0,
        registration_type: 'individual',
        min_team_size: 1,
        max_team_size: 1,
        rules:
          '1. Bring a laptop with Docker and Node.js / Python 3.11 installed.\n2. Free sandbox API credits provided upon check-in.\n3. Digital certification awarded on completion of the capstone project.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        id: 'evt-005',
        title: 'InnovateX: Annual Technical Project Expo',
        description:
          'Showcase your capstone, IoT, embedded systems, clean tech, or software prototypes to venture capitalists, angel investors, and industry executives. Features live prototype booths and elevator pitch stages.',
        category: 'Project Exhibitions',
        banner_url:
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-12-05',
        start_time: '09:30',
        end_time: '16:30',
        venue: 'Nexus Exhibition Center, Ground Floor',
        organizer_name: 'Nexus Incubation & Entrepreneurship Cell',
        contact_email: 'innovatex@nexustech.edu',
        registration_deadline: '2026-11-25T23:59:59.000Z',
        max_participants: 40,
        registration_fee: 0,
        registration_type: 'team',
        min_team_size: 1,
        max_team_size: 4,
        rules:
          '1. Working prototype or hardware demonstration mandatory.\n2. Poster board dimensions: A1 landscape.\n3. 5-minute technical pitch followed by 3-minute jury Q&A.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'evt-006',
        title: 'Turing Cup: Intercollegiate Technical Quiz',
        description:
          'Test your knowledge across computing history, semiconductor architectures, cryptography, cybersecurity, open source trivia, and cutting-edge tech innovations in rapid buzzer rounds.',
        category: 'Technical Quizzes',
        banner_url:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-12',
        start_time: '15:00',
        end_time: '18:00',
        venue: 'Auditorium Hall B',
        organizer_name: 'Nexus Quiz Club',
        contact_email: 'turingquiz@nexustech.edu',
        registration_deadline: '2026-11-10T23:59:59.000Z',
        max_participants: 35,
        registration_fee: 0,
        registration_type: 'team',
        min_team_size: 2,
        max_team_size: 2,
        rules:
          '1. Exactly two members per team.\n2. Preliminary written elimination followed by top 6 on-stage buzzer finale.\n3. Negative marking applies in the lightning round.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: 'evt-007',
        title: 'Colloquium on Quantum Computing & Post-Quantum Cryptography',
        description:
          'Submit and present research papers on quantum gate simulations, lattice-based cryptography, and quantum error mitigation before peer reviewers and faculty researchers.',
        category: 'Paper Presentations',
        banner_url:
          'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-12-10',
        start_time: '10:00',
        end_time: '16:00',
        venue: 'Conference Hall A1',
        organizer_name: 'Nexus Research & Publication Committee',
        contact_email: 'colloquium@nexustech.edu',
        registration_deadline: '2026-11-30T23:59:59.000Z',
        max_participants: 30,
        registration_fee: 0,
        registration_type: 'team',
        min_team_size: 1,
        max_team_size: 2,
        rules:
          '1. IEEE double-column format manuscript max 6 pages.\n2. Plagiarism index must be below 10%.\n3. 12-minute presentation followed by 5-minute technical review discussion.',
        status: 'published',
        created_by: adminProfile.id,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];

    const initialRegistrations: Registration[] = [
      {
        id: 'reg-001',
        event_id: 'evt-001',
        student_id: studentProfile.id,
        team_name: 'CyberVanguard',
        team_members: [
          {
            name: 'Alex Chen',
            email: 'alex.chen@nexustech.edu',
            college: 'Nexus Institute of Technology',
            department: 'Computer Science',
            year: '3rd Year',
            phone: '+1 555-234-8901',
          },
          {
            name: 'Jordan Lee',
            email: 'jordan.lee@nexustech.edu',
            college: 'Nexus Institute of Technology',
            department: 'Information Science',
            year: '3rd Year',
            phone: '+1 555-889-1122',
          },
          {
            name: 'Samira Patel',
            email: 'samira.patel@nexustech.edu',
            college: 'Nexus Institute of Technology',
            department: 'AI & Data Engineering',
            year: '3rd Year',
            phone: '+1 555-772-9900',
          },
        ],
        registration_status: 'confirmed',
        registered_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'reg-002',
        event_id: 'evt-002',
        student_id: studentProfile.id,
        team_name: null,
        team_members: [],
        registration_status: 'confirmed',
        registered_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'reg-003',
        event_id: 'evt-004',
        student_id: studentProfile2.id,
        team_name: null,
        team_members: [],
        registration_status: 'confirmed',
        registered_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];

    this.data = {
      profiles: [adminProfile, studentProfile, studentProfile2],
      events: initialEvents,
      registrations: initialRegistrations,
    };
  }

  // Profile operations
  public getProfiles(): Profile[] {
    return this.data.profiles;
  }

  public findProfileById(id: string): Profile | undefined {
    return this.data.profiles.find((p) => p.id === id);
  }

  public findProfileByEmail(email: string): Profile | undefined {
    return this.data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  public createProfile(profile: Profile): Profile {
    this.data.profiles.push(profile);
    this.save();
    return profile;
  }

  public updateProfile(id: string, updates: Partial<Omit<Profile, 'id' | 'password_hash' | 'role'>>): Profile | null {
    const idx = this.data.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.profiles[idx] = { ...this.data.profiles[idx], ...updates };
    this.save();
    return this.data.profiles[idx];
  }

  // Event operations
  public getEvents(filters?: {
    status?: EventStatus;
    category?: EventCategory;
    search?: string;
    includeDrafts?: boolean;
  }): TechnicalEvent[] {
    let list = this.data.events;

    if (!filters?.includeDrafts) {
      list = list.filter((e) => e.status === 'published');
    } else if (filters?.status) {
      list = list.filter((e) => e.status === filters.status);
    }

    if (filters?.category) {
      list = list.filter((e) => e.category === filters.category);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer_name.toLowerCase().includes(q)
      );
    }

    // Attach registration metrics
    return list.map((evt) => this.hydrateEventMetrics(evt));
  }

  public findEventById(id: string): TechnicalEvent | undefined {
    const evt = this.data.events.find((e) => e.id === id);
    return evt ? this.hydrateEventMetrics(evt) : undefined;
  }

  public createEvent(eventData: Omit<TechnicalEvent, 'id' | 'created_at' | 'updated_at'>): TechnicalEvent {
    const now = new Date().toISOString();
    const id = 'evt-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newEvent: TechnicalEvent = {
      ...eventData,
      id,
      created_at: now,
      updated_at: now,
    };
    this.data.events.unshift(newEvent);
    this.save();
    return this.hydrateEventMetrics(newEvent);
  }

  public updateEvent(id: string, updates: Partial<TechnicalEvent>): TechnicalEvent | null {
    const idx = this.data.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    this.data.events[idx] = {
      ...this.data.events[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.hydrateEventMetrics(this.data.events[idx]);
  }

  public deleteEvent(id: string): boolean {
    const initialLen = this.data.events.length;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    // Cascade delete registrations
    this.data.registrations = this.data.registrations.filter((r) => r.event_id !== id);
    this.save();
    return this.data.events.length < initialLen;
  }

  // Registration operations
  public getRegistrations(filters?: {
    eventId?: string;
    studentId?: string;
    status?: RegistrationStatus;
    search?: string;
  }): Registration[] {
    let list = this.data.registrations;

    if (filters?.eventId) {
      list = list.filter((r) => r.event_id === filters.eventId);
    }

    if (filters?.studentId) {
      list = list.filter((r) => r.student_id === filters.studentId);
    }

    if (filters?.status) {
      list = list.filter((r) => r.registration_status === filters.status);
    }

    let hydrated = list.map((reg) => this.hydrateRegistration(reg));

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      hydrated = hydrated.filter((r) => {
        const studentName = r.student?.full_name?.toLowerCase() || '';
        const studentEmail = r.student?.email?.toLowerCase() || '';
        const eventTitle = r.event?.title?.toLowerCase() || '';
        const teamName = r.team_name?.toLowerCase() || '';
        return (
          studentName.includes(q) ||
          studentEmail.includes(q) ||
          eventTitle.includes(q) ||
          teamName.includes(q)
        );
      });
    }

    return hydrated;
  }

  public findRegistration(eventId: string, studentId: string): Registration | undefined {
    const reg = this.data.registrations.find(
      (r) => r.event_id === eventId && r.student_id === studentId
    );
    return reg ? this.hydrateRegistration(reg) : undefined;
  }

  public findRegistrationById(id: string): Registration | undefined {
    const reg = this.data.registrations.find((r) => r.id === id);
    return reg ? this.hydrateRegistration(reg) : undefined;
  }

  public createRegistration(data: {
    event_id: string;
    student_id: string;
    team_name?: string | null;
    team_members?: TeamMember[];
  }): { registration?: Registration; error?: string } {
    const event = this.findEventById(data.event_id);
    if (!event) {
      return { error: 'Event not found.' };
    }

    if (event.status !== 'published') {
      return { error: 'Registrations are currently closed for this event.' };
    }

    const now = new Date();
    const deadline = new Date(event.registration_deadline);
    if (now > deadline) {
      return { error: 'Registration deadline has passed for this event.' };
    }

    const confirmedCount = this.data.registrations.filter(
      (r) => r.event_id === data.event_id && r.registration_status === 'confirmed'
    ).length;

    if (confirmedCount >= event.max_participants) {
      return { error: 'Event capacity reached. No seats available.' };
    }

    // Check duplicate registration
    const existing = this.data.registrations.find(
      (r) =>
        r.event_id === data.event_id &&
        r.student_id === data.student_id &&
        r.registration_status !== 'cancelled'
    );
    if (existing) {
      return { error: 'You are already registered for this event.' };
    }

    // Team size validation if team registration
    if (event.registration_type === 'team') {
      const members = data.team_members || [];
      const totalTeamSize = members.length + 1; // leader + members
      if (totalTeamSize < event.min_team_size) {
        return {
          error: `Minimum team size is ${event.min_team_size}. You currently have ${totalTeamSize}.`,
        };
      }
      if (totalTeamSize > event.max_team_size) {
        return {
          error: `Maximum team size is ${event.max_team_size}. You provided ${totalTeamSize}.`,
        };
      }
      if (!data.team_name || data.team_name.trim().length === 0) {
        return { error: 'Team name is required for team registrations.' };
      }
    }

    const newReg: Registration = {
      id: 'reg-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      event_id: data.event_id,
      student_id: data.student_id,
      team_name: data.team_name || null,
      team_members: data.team_members || [],
      registration_status: 'confirmed',
      registered_at: new Date().toISOString(),
    };

    this.data.registrations.unshift(newReg);
    this.save();

    return { registration: this.hydrateRegistration(newReg) };
  }

  public updateRegistrationStatus(id: string, status: RegistrationStatus): Registration | null {
    const idx = this.data.registrations.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.registrations[idx].registration_status = status;
    this.save();
    return this.hydrateRegistration(this.data.registrations[idx]);
  }

  public cancelRegistration(id: string, studentId: string): { success: boolean; error?: string } {
    const idx = this.data.registrations.findIndex(
      (r) => r.id === id && r.student_id === studentId
    );
    if (idx === -1) {
      return { success: false, error: 'Registration not found or unauthorized.' };
    }
    this.data.registrations[idx].registration_status = 'cancelled';
    this.save();
    return { success: true };
  }

  // Stats operations for admin dashboard
  public getAdminStats() {
    const totalEvents = this.data.events.length;
    const publishedEvents = this.data.events.filter((e) => e.status === 'published').length;
    const totalStudents = this.data.profiles.filter((p) => p.role === 'student').length;
    const totalRegistrations = this.data.registrations.filter(
      (r) => r.registration_status === 'confirmed'
    ).length;

    const now = new Date();
    const upcomingEvents = this.data.events.filter(
      (e) => new Date(e.event_date) >= now && e.status === 'published'
    ).length;

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    for (const evt of this.data.events) {
      categoryCounts[evt.category] = (categoryCounts[evt.category] || 0) + 1;
    }

    // Registrations per event
    const eventStats = this.data.events.map((evt) => {
      const regCount = this.data.registrations.filter(
        (r) => r.event_id === evt.id && r.registration_status === 'confirmed'
      ).length;
      return {
        id: evt.id,
        title: evt.title,
        category: evt.category,
        event_date: evt.event_date,
        max_participants: evt.max_participants,
        registered_count: regCount,
        available_seats: Math.max(0, evt.max_participants - regCount),
        fill_percentage: Math.min(100, Math.round((regCount / evt.max_participants) * 100)),
        status: evt.status,
      };
    });

    const recentRegistrations = this.getRegistrations().slice(0, 8);

    return {
      totalEvents,
      publishedEvents,
      totalStudents,
      totalRegistrations,
      upcomingEvents,
      categoryCounts,
      eventStats,
      recentRegistrations,
    };
  }

  // Hydration helpers
  private hydrateEventMetrics(evt: TechnicalEvent): TechnicalEvent {
    const confirmedCount = this.data.registrations.filter(
      (r) => r.event_id === evt.id && r.registration_status === 'confirmed'
    ).length;
    const available = Math.max(0, evt.max_participants - confirmedCount);
    const isExpired = new Date() > new Date(evt.registration_deadline);
    const isFull = confirmedCount >= evt.max_participants;

    return {
      ...evt,
      registered_count: confirmedCount,
      available_seats: available,
      is_full: isFull,
      is_expired: isExpired,
    };
  }

  private hydrateRegistration(reg: Registration): Registration {
    const rawEvent = this.data.events.find((e) => e.id === reg.event_id);
    const rawStudent = this.data.profiles.find((p) => p.id === reg.student_id);

    let event: TechnicalEvent | undefined;
    if (rawEvent) {
      event = this.hydrateEventMetrics(rawEvent);
    }

    let student: Omit<Profile, 'password_hash'> | undefined;
    if (rawStudent) {
      const { password_hash, ...rest } = rawStudent;
      student = rest;
    }

    return {
      ...reg,
      event,
      student,
    };
  }
}

export const db = new Database();
