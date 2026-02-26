# LOS Familia

**Life Operating System for Families** — a real-time family command center that goes beyond what Skylight offers, delivered through any web-enabled device.

## What is this?

LOS Familia is a web app designed for a family of five (2 parents, 3 children) that replaces proprietary hardware calendars like Skylight with an open, browser-based alternative. It runs on laptops, iPads, and Amazon Fire tablets as a PWA.

### Core features

- **Time-aware task timeline** — Each task has an allocated duration within morning/afternoon/evening sections. Children see real-time countdowns showing what's happening now, how long remains, and what's next.
- **Parent accept flow** — Children mark tasks as "done"; parents review and "accept" to award stars.
- **Star rewards system** — Tasks earn stars. Full ledger audit trail.
- **Shared family calendar** — Weekly view with color-coded events.
- **Role-based access** — Parents get admin dashboards; children get simplified timeline views. PIN-based login (no emails needed for kids).

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS 4 + shadcn/ui |
| Database | Supabase (Postgres) |
| Realtime | Supabase Realtime (Postgres changes) |
| Auth | PIN-based family member selection (Supabase RLS) |
| Hosting | Vercel (staging + production) |
| PWA | Service worker + manifest for installable experience |

## Getting started

```bash
# Clone
git clone https://github.com/skoljj/los-familia.git
cd los-familia

# Install
npm install

# Set up environment
cp .env.local.example .env.local
# Fill in your Supabase project URL and anon key

# Run the migration against your Supabase project
# (paste supabase/migrations/001_initial_schema.sql into the Supabase SQL editor)
# (paste supabase/migrations/002_increment_stars_rpc.sql into the Supabase SQL editor)

# Seed sample data
# (paste supabase/seed.sql into the Supabase SQL editor)

# Run dev server
npm run dev
```

## Deployment

- **Production**: `main` branch auto-deploys to Vercel
- **Staging**: `staging` branch deploys to a preview URL
- **PR previews**: Every feature branch PR gets an ephemeral preview

Each environment connects to its own Supabase project via environment variables in Vercel.

## Project structure

```
app/
  page.js              Landing / auth redirect
  login/page.js        Avatar + PIN login
  dashboard/page.js    Parent: overview, stats, child timelines
  timeline/page.js     Child: real-time task timeline with countdowns
  tasks/page.js        Parent: task CRUD management
  calendar/page.js     Shared family calendar (weekly view)
  stars/page.js        Star balance + history
  api/tasks/route.js   Task CRUD API
  api/stars/route.js   Star ledger API
components/
  Timeline.jsx         Real-time section timeline with Supabase subscriptions
  TaskCard.jsx         Task display with phase (now/next/later/done), timer
  CountdownTimer.jsx   Live countdown for active tasks
  DaySectionBar.jsx    Progress bar for current day section
  StarCounter.jsx      Star balance badge
  NavBar.jsx           Role-aware navigation
  FamilyMemberPicker.jsx  Avatar-based member selector
lib/
  supabase-client.js   Browser-side Supabase client
  supabase-server.js   Server-side Supabase client
  auth-context.js      React context for family member auth
  time-utils.js        Timeline computation (sections, phases, countdowns)
supabase/
  migrations/          SQL migration files
  seed.sql             Sample family data
```
