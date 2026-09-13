# Priyadarsani Classes - Coaching Management & AI Platform

## Project Overview
This is a real-world, production-quality education platform for Priyadarsani Classes (Mumbai, Maharashtra State Board).
It manages students, teachers, subjects, batches, attendance, fees, and includes advanced AI features (Doubt Solving, RAG-based material, Image Question Solver, Voice IO, Test Generation).

**Key Rule for AI Agents**: DO NOT just generate code blindly. Read this file. Follow the phase-wise development approach. Do NOT write fake implementations or use dummy components unless explicitly mocked and marked. Ensure technically correct decisions, security, and scalability.

## Tech Stack
- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes / Node.js
- **Database**: PostgreSQL (managed via Drizzle ORM). Supabase can be used if appropriate.
- **Auth**: Custom email-based (JWT/bcrypt) with Role-Based Access Control (RBAC).

## Capacity
- **Scalability**: The system is designed using a scalable Next.js + PostgreSQL architecture. Yes, this architecture will effortlessly handle **1,500+ students** and their concurrent requests, provided we write optimized database queries (via Drizzle), use proper indexing, and leverage Next.js caching.

## Development Phases
- **PHASE 0**: Requirements + Information Architecture + UI/UX *(CURRENT PHASE)*
- **PHASE 1**: Project foundation + Authentication + Roles *(PARTIALLY DONE, BUT PREMATURELY)*
- **PHASE 2**: Public Website
- **PHASE 3**: Student Dashboard
- **PHASE 4**: Teacher/Admin Dashboard
- **PHASE 5**: Study Material + Content Management
- **PHASE 6**: AI Doubt Solver + RAG
- **PHASE 7**: Image + Voice AI
- **PHASE 8**: Tests + AI Practice Generator
- **PHASE 9**: AI Question Paper Generator
- **PHASE 10**: Performance Analytics
- **PHASE 11**: Fees + Online Payments
- **PHASE 12**: Security + Testing + Production Deployment
- **PHASE 13**: Mobile App

## Current State & AI Deviation Notice
The user requested **Phase 0** to be completed FIRST (creating the complete Information Architecture for menus, before writing application code).
However, a previous AI skipped Phase 0 and prematurely scaffolded out API routes, DB schemas, and UI components for Phases 1, 2, and 3.

**Differences between User's Master Plan and AI's execution:**
1. The previous AI skipped the "Information Architecture" approval step.
2. Code was generated before defining what goes into the menus.
3. Database schema was created but misses AI specific tables like `document_chunks` with `pgvector` for RAG support.
4. Dummy components were generated across the `src/` directory without waiting for the exact requirements.

## Next Steps for AI Agents
1. Acknowledge the premature code generation.
2. Re-focus on **PHASE 0**. Provide the Information Architecture for Admin, Teacher, and Student menus.
3. Wait for the user's approval before adding more code to `src/`.
