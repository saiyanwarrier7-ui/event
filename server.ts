import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { db, TechnicalEvent, RegistrationStatus } from './server/db.js';
import {
  generateToken,
  requireAuth,
  requireAdmin,
  AuthenticatedRequest,
} from './server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for banners
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Curated high quality technical banner presets
const BANNER_PRESETS = [
  {
    title: 'AI & Hackathon Matrix',
    category: 'Hackathons',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Code Sprint & Algorithms',
    category: 'Coding Competitions',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Robotics & Hardware Lab',
    category: 'Robotics',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Neural Networks & Cloud Tech',
    category: 'Workshops',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Project Exhibition & Prototypes',
    category: 'Project Exhibitions',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Tech Quiz & Trivia Championship',
    category: 'Technical Quizzes',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Quantum & Academic Research Paper',
    category: 'Paper Presentations',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cybersecurity & DefCon Arena',
    category: 'Coding Competitions',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
];

// ==========================================
// AUTH ROUTES
// ==========================================

// Register new student
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const {
      full_name,
      email,
      password,
      college_name,
      department,
      year_of_study,
      phone,
    } = req.body;

    if (!full_name || !email || !password || !college_name || !department || !year_of_study || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.findProfileByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const newProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      college_name: college_name.trim(),
      department: department.trim(),
      year_of_study: year_of_study.trim(),
      phone: phone.trim(),
      role: 'student' as const,
      created_at: new Date().toISOString(),
    };

    db.createProfile(newProfile);

    const token = generateToken(newProfile);
    const { password_hash: _, ...safeUser } = newProfile;

    return res.status(201).json({
      message: 'Registration successful! Welcome to NexusTech.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const profile = db.findProfileByEmail(email);
    if (!profile) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, profile.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(profile);
    const { password_hash: _, ...safeUser } = profile;

    return res.json({
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Get current user profile
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const profile = db.findProfileById(req.user!.id);
  if (!profile) {
    return res.status(404).json({ error: 'User profile not found.' });
  }
  const { password_hash: _, ...safeUser } = profile;
  return res.json({ user: safeUser });
});

// Update profile
app.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { full_name, college_name, department, year_of_study, phone } = req.body;
    const updated = db.updateProfile(req.user!.id, {
      full_name,
      college_name,
      department,
      year_of_study,
      phone,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Failed to update profile.' });
    }

    const { password_hash: _, ...safeUser } = updated;
    return res.json({ message: 'Profile updated successfully.', user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ==========================================
// EVENT ROUTES
// ==========================================

// Get events (public or admin filter)
app.get('/api/events', (req: Request, res: Response) => {
  try {
    const { category, search, status, includeDrafts } = req.query;
    const authHeader = req.headers.authorization;
    let isAdmin = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = jwtDecode(token) as any;
      if (payload?.role === 'admin') {
        isAdmin = true;
      }
    }

    const events = db.getEvents({
      category: category as any,
      search: search as string,
      status: status as any,
      includeDrafts: includeDrafts === 'true' && isAdmin,
    });

    return res.json({ events });
  } catch (err: any) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ error: 'Failed to load events.' });
  }
});

function jwtDecode(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

// Get single event
app.get('/api/events/:id', (req: Request, res: Response) => {
  const event = db.findEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found.' });
  }
  return res.json({ event });
});

// Create event (Admin)
app.post('/api/events', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      banner_url,
      event_date,
      start_time,
      end_time,
      venue,
      organizer_name,
      contact_email,
      registration_deadline,
      max_participants,
      registration_fee,
      registration_type,
      min_team_size,
      max_team_size,
      rules,
      status,
    } = req.body;

    if (!title || !description || !category || !banner_url || !event_date || !venue) {
      return res.status(400).json({ error: 'Missing required event fields.' });
    }

    const newEvent = db.createEvent({
      title: title.trim(),
      description: description.trim(),
      category,
      banner_url,
      event_date,
      start_time: start_time || '09:00',
      end_time: end_time || '17:00',
      venue: venue.trim(),
      organizer_name: organizer_name?.trim() || 'Technical Committee',
      contact_email: contact_email?.trim() || 'events@nexustech.edu',
      registration_deadline: registration_deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
      max_participants: parseInt(max_participants, 10) || 50,
      registration_fee: parseFloat(registration_fee) || 0,
      registration_type: registration_type || 'individual',
      min_team_size: parseInt(min_team_size, 10) || 1,
      max_team_size: parseInt(max_team_size, 10) || 1,
      rules: rules || 'Follow general university event guidelines.',
      status: status || 'draft',
      created_by: req.user!.id,
    });

    return res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  } catch (err: any) {
    console.error('Create event error:', err);
    return res.status(500).json({ error: 'Failed to create event.' });
  }
});

// Update event (Admin)
app.put('/api/events/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ message: 'Event updated successfully.', event: updated });
  } catch (err: any) {
    console.error('Update event error:', err);
    return res.status(500).json({ error: 'Failed to update event.' });
  }
});

// Delete event (Admin)
app.delete('/api/events/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ message: 'Event deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// Toggle status (Admin)
app.patch('/api/events/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid event status.' });
    }
    const updated = db.updateEvent(req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ message: `Event status updated to ${status}.`, event: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update event status.' });
  }
});

// ==========================================
// REGISTRATION ROUTES
// ==========================================

// Student view own registrations
app.get('/api/registrations/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const registrations = db.getRegistrations({ studentId: req.user!.id });
    return res.json({ registrations });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve registrations.' });
  }
});

// Student register for event
app.post('/api/registrations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { event_id, team_name, team_members } = req.body;
    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required.' });
    }

    const result = db.createRegistration({
      event_id,
      student_id: req.user!.id,
      team_name,
      team_members,
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Registration successful! Your pass is confirmed.',
      registration: result.registration,
    });
  } catch (err: any) {
    console.error('Registration creation error:', err);
    return res.status(500).json({ error: 'Internal error processing registration.' });
  }
});

// Student cancel registration
app.patch('/api/registrations/:id/cancel', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = db.cancelRegistration(req.params.id, req.user!.id);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to cancel registration.' });
    }
    return res.json({ message: 'Registration cancelled successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to cancel registration.' });
  }
});

// ==========================================
// ADMIN DASHBOARD & REGISTRATIONS
// ==========================================

// Admin overview stats
app.get('/api/admin/stats', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = db.getAdminStats();
    return res.json({ stats });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to calculate statistics.' });
  }
});

// Admin list registrations with filters
app.get('/api/admin/registrations', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventId, status, search } = req.query;
    const registrations = db.getRegistrations({
      eventId: eventId as string,
      status: status as RegistrationStatus,
      search: search as string,
    });
    return res.json({ registrations });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load registrations.' });
  }
});

// Admin update registration status (approve, reject, cancel)
app.patch('/api/admin/registrations/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'pending', 'cancelled', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid registration status.' });
    }
    const updated = db.updateRegistrationStatus(req.params.id, status as RegistrationStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    return res.json({ message: `Registration status updated to ${status}.`, registration: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update registration status.' });
  }
});

// Admin view students directory
app.get('/api/admin/students', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const profiles = db.getProfiles().filter((p) => p.role === 'student');
    const studentList = profiles.map((p) => {
      const studentRegs = db.getRegistrations({ studentId: p.id });
      const { password_hash: _, ...safeUser } = p;
      return {
        ...safeUser,
        total_registrations: studentRegs.length,
        active_registrations: studentRegs.filter((r) => r.registration_status === 'confirmed').length,
      };
    });
    return res.json({ students: studentList });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load students.' });
  }
});

// Admin CSV Export
app.get('/api/admin/events/:id/export-csv', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = db.findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const registrations = db.getRegistrations({ eventId: event.id });

    // Build CSV
    const headers = [
      'Registration ID',
      'Registered At',
      'Status',
      'Student Name',
      'Student Email',
      'College',
      'Department',
      'Year of Study',
      'Phone',
      'Team Name',
      'Team Members Count',
      'Team Members Info',
    ];

    const rows = registrations.map((r) => {
      const teamDetails = (r.team_members || [])
        .map((m) => `${m.name} (${m.email}, ${m.department || ''})`)
        .join('; ');

      const clean = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;

      return [
        clean(r.id),
        clean(new Date(r.registered_at).toLocaleString()),
        clean(r.registration_status),
        clean(r.student?.full_name),
        clean(r.student?.email),
        clean(r.student?.college_name),
        clean(r.student?.department),
        clean(r.student?.year_of_study),
        clean(r.student?.phone),
        clean(r.team_name || 'N/A'),
        clean(r.team_members?.length || 0),
        clean(teamDetails || 'None'),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const safeTitle = event.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_registrations.csv"`);
    return res.send(csvContent);
  } catch (err: any) {
    console.error('CSV Export error:', err);
    return res.status(500).json({ error: 'Failed to generate CSV export.' });
  }
});

// Banner presets & upload
app.get('/api/banners/presets', (_req: Request, res: Response) => {
  return res.json({ presets: BANNER_PRESETS });
});

app.post('/api/upload/banner', requireAdmin, upload.single('banner'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl, message: 'Banner uploaded successfully.' });
});

// System info / Supabase readiness status
app.get('/api/system/info', (_req: Request, res: Response) => {
  const hasSupabaseUrl = Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
  const hasSupabaseKey = Boolean(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
  return res.json({
    engine: 'NexusTech Core Engine (Persistent JSON & SQL Compatible)',
    supabaseConfigured: hasSupabaseUrl && hasSupabaseKey,
    supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || null,
    totalEvents: db.getEvents({ includeDrafts: true }).length,
    totalProfiles: db.getProfiles().length,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusTech Technical Event Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
