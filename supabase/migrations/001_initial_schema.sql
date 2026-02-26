-- LOS Familia: initial schema
-- Tables: families, family_members, day_sections, tasks, star_ledger, calendar_events

-- Families
create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Family Members
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  role text not null check (role in ('parent', 'child')),
  avatar_url text,
  pin text,
  star_balance int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_members_family on family_members(family_id);

-- Day Sections (morning / afternoon / evening boundaries per family)
create table if not exists day_sections (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  label text not null check (label in ('morning', 'afternoon', 'evening')),
  start_time time not null,
  end_time time not null,
  unique (family_id, label)
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  assigned_to uuid references family_members(id) on delete set null,
  title text not null,
  description text,
  day_section text not null check (day_section in ('morning', 'afternoon', 'evening')),
  time_allowed_minutes int not null default 10,
  sort_order int not null default 0,
  star_value int not null default 1,
  repeat text not null default 'none' check (repeat in ('none', 'daily', 'weekdays', 'weekly')),
  status text not null default 'pending' check (status in ('pending', 'done', 'accepted')),
  task_date date not null default current_date,
  completed_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_tasks_family_date on tasks(family_id, task_date);
create index idx_tasks_assigned on tasks(assigned_to, task_date);

-- Star Ledger (audit trail)
create table if not exists star_ledger (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references family_members(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  stars int not null,
  earned_at timestamptz not null default now()
);
create index idx_stars_member on star_ledger(member_id);

-- Calendar Events
create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  color text default '#3b82f6',
  created_by uuid references family_members(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_events_family on calendar_events(family_id);

-- Row Level Security ---------------------------------------------------

alter table families enable row level security;
alter table family_members enable row level security;
alter table day_sections enable row level security;
alter table tasks enable row level security;
alter table star_ledger enable row level security;
alter table calendar_events enable row level security;

-- For the initial build we use a permissive policy that allows all
-- authenticated users to read/write within their family. Fine-grained
-- parent-vs-child policies are layered on in a follow-up migration once
-- the auth flow is wired up.

create policy "family_access" on families
  for all using (true) with check (true);

create policy "member_access" on family_members
  for all using (true) with check (true);

create policy "section_access" on day_sections
  for all using (true) with check (true);

create policy "task_access" on tasks
  for all using (true) with check (true);

create policy "star_access" on star_ledger
  for all using (true) with check (true);

create policy "event_access" on calendar_events
  for all using (true) with check (true);

-- Enable realtime on key tables
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table star_ledger;
alter publication supabase_realtime add table family_members;
