# NexusTech — Technical Event Registration Portal

NexusTech is an enterprise-grade full-stack Technical Event Registration website designed for universities and engineering colleges. The platform allows faculty administrators to create, publish, and manage multi-disciplinary technical events, while students can browse, search, team-up, and register online with verified digital passes.

---

## 🚀 Key Features

### 1. Student Experience
- **Secure Authentication & Onboarding:** Registration with university email, college, department, year of study, and phone number.
- **Dynamic Event Discovery:** Real-time search by title, organizer, or venue. Multi-category filtering across Hackathons, Coding Competitions, Robotics, Workshops, Project Exhibitions, Paper Presentations, and Technical Quizzes.
- **Seat Capacity & Deadline Guards:** Real-time capacity progress indicators and automatic cutoff when registration deadlines expire or maximum seats are reached.
- **Individual & Squad/Team Registrations:** Dynamic team roster builder with validations for minimum and maximum squad sizes.
- **Digital Event Pass & Badges:** Printable check-in passes with unique alphanumeric IDs and QR verification.
- **Student Dashboard & "My Registrations":** Track confirmed passes, review team rosters, and cancel registrations before deadlines.

### 2. Administrator Console
- **Protected RBAC Authorization:** Admin routes protected both on the client and with Express middleware (`requireAdmin`).
- **Real-Time Telemetry Dashboard:** Total events, student registrations, seat occupancy percentages, and category distributions.
- **Event Lifecycle Management:** Form for creating and editing events with banner presets, venue details, dates, participant limits, and rules.
- **Publication Controls:** Instant status switching between `Draft` (hidden), `Published` (open), and `Closed`.
- **Attendance & Registrations Manager:** Filter registrations by event and status (`confirmed`, `pending`, `cancelled`, `rejected`).
- **CSV Data Export:** One-click export of complete attendee lists with team member details formatted for spreadsheets.
- **Student Directory:** Comprehensive roster of verified students and event participation metrics.

---

## 🛠️ Tech Stack & Database Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend & API:** Node.js Express server running with Vite middleware on port 3000
- **Database Engine:**
  - **Local & Preview:** Persistent JSON engine at `data/database.json` with relational foreign keys, constraints, and atomic writes.
  - **PostgreSQL / Supabase Migration:** Production-ready schema in `supabase_schema.sql` with Row Level Security (RLS) policies, indexes, and triggers.

---

## 🔑 Demo Credentials (Out of the Box)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@nexustech.edu` | `Admin@nexus2026` |
| **Student** | `alex.chen@nexustech.edu` | `Student@nexus2026` |

*Note: You can also use the 1-Click Autofill buttons on the login page or register a brand-new student account.*

---

## 📋 Complete 9-Step Verification Workflow

1. **Administrator Login:** Visit `/admin/login`, click **Autofill Admin**, and sign in.
2. **Create & Publish Event:** In the Admin Console, click **Create New Event**, fill out details (or keep defaults), and click **Create & Publish Event**.
3. **Public Discovery:** Navigate to **Explore Events** (`/events`) — the new event is immediately visible with category tags and available seats.
4. **Student Account:** Sign out and register a new student at `/register` (or log in as `alex.chen@nexustech.edu`).
5. **Event Registration:** Select an event, click **Register**, fill in team details if required, and submit.
6. **Persistence:** The registration record is saved with unique ID, status, and seat decrement.
7. **Student Dashboard:** View the confirmed pass in **My Registrations** (`/student/registrations`) with printable badge.
8. **Admin Dashboard Telemetry:** Log back into `/admin/dashboard` to see the updated registration count and occupancy bar.
9. **CSV Export:** Go to `/admin/events`, click the CSV icon next to the event, and download the exported CSV file.

---

## ⚙️ Running Locally

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `supabase_schema.sql` and click **Run**.
4. Configure your `.env` variables:
   ```env
   VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<your-anon-key>"
   JWT_SECRET="<your-production-secret>"
   ```
5. Build and deploy:
   ```bash
   npm run build
   npm start
   ```
