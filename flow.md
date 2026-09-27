# PRIYADARSHANI CLASSES — AI AGENT MASTER GUIDE
# Read this entire file before touching any code.

---

## INSTITUTE INFORMATION

- Name: Priyadarshani Classes
- Location: Mumbai, Maharashtra, India
- Board: Maharashtra State Board
- Scale: 1,000+ students (target 1,500+)
- Key Person: Prem Sir (Founder/Teacher)
- Brand Tagline: "Smart Learning. Better Future."

---

## TECH STACK

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS 4
- Database: PostgreSQL via Drizzle ORM (Supabase hosted)
- Auth: Custom JWT + bcrypt (jose library), Role-Based Access Control
- AI: Provider-independent service layer (OpenAI compatible)
- Deployment: Vercel (testing/dev), production TBD
- Storage: TBD (Supabase Storage or S3)

---

## CREDENTIALS (Development/Seed Only)

- Admin: admin@priyadarshani.com / Admin@123
- Teacher: prem.sir@priyadarshani.com / Teacher@123
- Student: rohan.sharma@student.com / Student@123

---

## ROLES

1. admin — Full access to everything
2. teacher — Manage students, batches, material, tests, attendance
3. student — Own dashboard, profile, AI tools, study material

---

## PROJECT FOLDER STRUCTURE

```
src/
  app/
    page.tsx                    — Public homepage
    layout.tsx                  — Root layout
    login/page.tsx              — Login (all roles)
    register/page.tsx           — Student registration
    admin/
      layout.tsx                — Admin layout with sidebar
      dashboard/page.tsx        — Admin dashboard
      students/page.tsx         — Student management
    student/
      layout.tsx                — Student layout with sidebar
      dashboard/page.tsx        — Student dashboard
      profile/page.tsx          — Student profile (editable)
      ai-doubt/page.tsx         — AI Doubt Solver
      subjects/page.tsx         — My Subjects
      practice-tests/page.tsx   — Practice Tests (shell)
      performance/page.tsx      — Performance (shell)
      study-material/page.tsx   — Study Material (shell)
      live-classes/page.tsx     — Live Classes (shell)
      recorded-classes/page.tsx — Recorded Classes (shell)
      assignments/page.tsx      — Assignments (shell)
      attendance/page.tsx       — Attendance (shell)
      test-results/page.tsx     — Test Results (shell)
      fees/page.tsx             — Fees (shell)
      timetable/page.tsx        — Timetable (shell)
      notices/page.tsx          — Notices (real data)
      help/page.tsx             — Help & Support (shell)
    api/
      auth/login/               — POST login
      auth/logout/              — POST logout
      auth/register/            — POST register
      auth/me/                  — GET current user
      admin/seed/               — POST seed DB (dev only, needs ALLOW_SEED=true)
      dashboard/admin/          — GET admin dashboard stats
      dashboard/student/        — GET student dashboard stats
      students/route.ts         — GET all students, POST create student
      students/[id]/            — GET/PATCH/DELETE single student
      students/profile/         — GET/PATCH own student profile
      subjects/                 — GET/POST subjects
      batches/                  — GET/POST batches
      attendance/               — GET/POST attendance
      notices/                  — GET/POST notices
      fees/                     — GET/POST fees
      tests/                    — GET/POST tests
      tests/results/            — GET test results
      study-material/           — GET/POST study material
      ai/doubt/                 — POST AI doubt solver
      ai/conversations/         — GET/POST AI conversations
      health/                   — GET health check
      demo/                     — POST demo request
  components/
    Logo.tsx                    — Brand logo component
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Card.tsx
      Badge.tsx
      StatCard.tsx
      EmptyState.tsx
      LoadingSkeleton.tsx
    public/
      PublicHeader.tsx
      HeroSection.tsx
      StatsSection.tsx
      FeaturesSection.tsx
      CoursesSection.tsx
      AILearningSection.tsx
      TeachersSection.tsx
      TestimonialsSection.tsx
      ContactSection.tsx
      PublicFooter.tsx
    student/
      StudentSidebar.tsx
      StudentHeader.tsx
    admin/
      AdminSidebar.tsx
  db/
    index.ts                    — Drizzle DB connection
    schema.ts                   — Full DB schema
  lib/
    auth.ts                     — JWT, bcrypt, session helpers
    utils.ts                    — Utility functions
  proxy.ts                      — Next.js proxy (auth middleware)
```

---

## DATABASE SCHEMA SUMMARY

Tables that EXIST in schema.ts:
- users (id, email, passwordHash, role, isActive, lastLogin)
- students (full profile, academic info, parent info, batchId)
- teachers (full profile, qualifications)
- teacherSubjects (many-to-many)
- batches (name, class, timing, teacherId, subjectId)
- subjects (name, code, color, icon)
- studentSubjects (many-to-many)
- timetable
- attendance
- studyMaterial
- notices
- tests + testQuestions + testAttempts + testAnswers
- assignments + assignmentSubmissions
- fees + payments
- aiConversations + aiMessages + aiUsage
- documentChunks (with pgvector for RAG — defined but NOT enabled in Supabase yet)
- demoRequests
- auditLogs

IMPORTANT: pgvector extension must be enabled in Supabase for RAG to work.
Run in Supabase SQL editor: CREATE EXTENSION IF NOT EXISTS vector;

---

## PHASE STATUS

### PHASE 0 — Information Architecture
STATUS: ❌ SKIPPED BY PREVIOUS AI
WHAT'S NEEDED: Formal approval of menus for Admin, Teacher, Student before more code is written.

### PHASE 1 — Foundation + Auth
STATUS: ⚠️ PARTIAL
DONE:
- Login, logout, register APIs
- JWT token creation and verification
- Role-based proxy (src/proxy.ts)
- bcrypt password hashing
MISSING:
- Forgot password flow
- Reset password flow
- Email sending (no email provider configured)
- Rate limiting on auth endpoints
- Refresh token strategy

### PHASE 2 — Public Website
STATUS: ⚠️ PARTIAL
DONE:
- Homepage with all sections (Hero, Stats, Features, Courses, AI, Teachers, Testimonials, Contact, Footer)
- Public header with navigation
MISSING:
- /about page
- /courses page (dedicated)
- /contact page (dedicated)
- /ai-learning page (dedicated)
- Book Free Demo form (API exists at /api/demo but no dedicated page)
- Real content (all text is placeholder)
- Real images (hero-student.jpg is missing — 404 error)

### PHASE 3 — Student Dashboard
STATUS: ⚠️ PARTIAL (shells only)
DONE:
- Student layout with sidebar and header
- Dashboard page (fetches real data from API)
- Profile page (fully functional — GET and PATCH work)
- AI Doubt Solver (basic text chat works if OPENAI_API_KEY is set)
- Notices page (fetches real data)
- Subjects page (fetches real data)
MISSING (shells with no real functionality):
- Attendance page
- Practice Tests page
- Performance page
- Study Material page
- Live Classes page
- Recorded Classes page
- Assignments page
- Test Results page
- Fees page
- Timetable page
- Help page

### PHASE 4 — Teacher/Admin Dashboard
STATUS: ⚠️ PARTIAL
DONE:
- Admin layout with sidebar
- Admin dashboard (partially real data, partially hardcoded)
- Admin students list page
MISSING:
- Teacher dashboard (ENTIRELY MISSING — no /teacher route)
- Admin: Batches management
- Admin: Subjects management
- Admin: Attendance management
- Admin: Tests management
- Admin: Study Material management
- Admin: Fees management
- Admin: Notices management
- Admin: Reports
- Admin: Settings
- Teacher: All pages

### PHASE 5 — Study Material + Content Management
STATUS: ❌ NOT STARTED
- API route exists but no file upload implementation
- No Supabase Storage or S3 integration
- No PDF processing

### PHASE 6 — AI Doubt Solver + RAG
STATUS: ⚠️ PARTIAL
DONE:
- Basic AI chat API (/api/ai/doubt)
- Conversation history API
- Student-facing UI for text chat
MISSING:
- RAG pipeline (document chunking, embeddings, vector search)
- pgvector not enabled in Supabase
- No document processing pipeline
- No context injection from uploaded material

### PHASE 7 — Image + Voice AI
STATUS: ❌ NOT STARTED

### PHASE 8 — Tests + AI Practice Generator
STATUS: ❌ NOT STARTED
- DB schema exists
- API routes exist (shells)
- No UI

### PHASE 9 — AI Question Paper Generator
STATUS: ❌ NOT STARTED

### PHASE 10 — Performance Analytics
STATUS: ❌ NOT STARTED

### PHASE 11 — Fees + Online Payments
STATUS: ❌ NOT STARTED
- DB schema exists
- API route exists (shell)
- No UI, no payment gateway

### PHASE 12 — Security + Testing + Production
STATUS: ❌ NOT STARTED
- No rate limiting
- No input sanitization beyond Zod
- No audit log writes
- No automated tests

### PHASE 13 — Mobile App
STATUS: ❌ NOT STARTED

---

## KNOWN BUGS / ISSUES

1. hero-student.jpg is missing from /public/images/ — causes 404 on homepage
2. Admin dashboard uses hardcoded fake data (student count 1254, teachers 12, etc.)
3. Student dashboard stats are partially hardcoded
4. Profile PATCH returns 400 if extra fields are sent (Zod schema too strict)
5. drizzle.config.ts uses DIRECT_URL for migrations (correct) but DATABASE_URL for runtime (correct)
6. src/components/public/images/ folder exists but should not — images belong in /public/images/
7. Teacher dashboard does not exist at all (/teacher/* routes are unprotected and return 404)
8. ALLOW_SEED env var must be set to "true" on Vercel to run seed — remove after seeding

---

## ENVIRONMENT VARIABLES REQUIRED

```
DATABASE_URL=postgresql://...?pgbouncer=true    # Supabase pooler (runtime)
DIRECT_URL=postgresql://...                      # Supabase direct (migrations)
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...                            # Required for AI features
ALLOW_SEED=true                                  # Only during initial setup, remove after
```

---

## WHAT TO BUILD NEXT (PRIORITY ORDER)

1. Fix hero-student.jpg 404 (add placeholder image to /public/images/)
2. Complete Phase 1: Add forgot-password and reset-password pages + API
3. Complete Phase 4: Build Teacher dashboard (entirely missing)
4. Complete Phase 4: Build remaining Admin pages (batches, subjects, fees, notices, tests)
5. Complete Phase 3: Fill in student shell pages with real data
6. Phase 5: File upload + study material management
7. Phase 6: RAG pipeline (enable pgvector, document processing, embeddings)
8. Phase 8: Tests and practice generator

---

## ARCHITECTURE SCALABILITY — 1500+ STUDENTS

YES — this architecture handles 1,500+ students comfortably IF:
- Database queries use proper indexes (already defined in schema)
- Drizzle ORM queries are optimized (avoid N+1 queries)
- Next.js API routes use proper caching where appropriate
- Supabase connection pooling is used (pgbouncer=true in DATABASE_URL)
- Vercel serverless functions scale automatically
- AI endpoints have per-user rate limiting (not yet implemented)

Bottlenecks to watch:
- AI API costs scale with usage — implement quotas
- File storage costs scale with uploads — implement size limits
- pgvector similarity search needs indexing for large document sets

---

## RULES FOR AI AGENTS WORKING ON THIS PROJECT

1. DO NOT skip phases or implement features out of order
2. DO NOT overwrite working functionality
3. DO NOT use hardcoded fake data in production code — mark mocks clearly
4. DO NOT expose API keys in frontend code
5. DO NOT create duplicate components — extend existing ones
6. DO NOT change database schema without migration
7. ALWAYS read existing files before modifying them
8. ALWAYS validate inputs with Zod on API routes
9. ALWAYS check role/session on every protected API route
10. ALWAYS handle loading, error, and empty states in UI
11. ASK before making architectural decisions
12. The correct spelling is PRIYADARSHANI (with 'sh') — not Priyadarsani
