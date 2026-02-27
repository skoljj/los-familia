-- Schedule Templates: named day-type patterns per child (Weekday, Weekend, Summer, etc.)
create table if not exists schedule_templates (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  assigned_to uuid not null references family_members(id) on delete cascade,
  name text not null,
  day_types text[] not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_templates_member on schedule_templates(assigned_to);

-- Schedule Blocks: time windows within a template
create table if not exists schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references schedule_templates(id) on delete cascade,
  label text not null,
  emoji text,
  start_time time not null,
  end_time time not null,
  block_type text not null default 'routine' check (block_type in ('routine', 'activity', 'free_time', 'passive')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_blocks_template on schedule_blocks(template_id);

-- Add icon and schedule_block_id to tasks
alter table tasks add column if not exists icon text;
alter table tasks add column if not exists schedule_block_id uuid references schedule_blocks(id) on delete set null;
create index if not exists idx_tasks_block on tasks(schedule_block_id);

-- RLS
alter table schedule_templates enable row level security;
alter table schedule_blocks enable row level security;

create policy "template_access" on schedule_templates
  for all using (true) with check (true);

create policy "block_access" on schedule_blocks
  for all using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table schedule_blocks;
