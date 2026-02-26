-- Seed data: one family of five with day sections and sample tasks
-- Run via Supabase SQL editor or: psql $DATABASE_URL -f supabase/seed.sql

-- Family
insert into families (id, name) values
  ('a0000000-0000-0000-0000-000000000001', 'The Familia');

-- Members (2 parents, 3 children)
insert into family_members (id, family_id, name, role, pin, star_balance) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Parent 1', 'parent', '1234', 0),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Parent 2', 'parent', '5678', 0),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Child 1',  'child',  '1111', 0),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Child 2',  'child',  '2222', 0),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Child 3',  'child',  '3333', 0);

-- Day sections
insert into day_sections (family_id, label, start_time, end_time) values
  ('a0000000-0000-0000-0000-000000000001', 'morning',   '07:00', '12:00'),
  ('a0000000-0000-0000-0000-000000000001', 'afternoon', '12:00', '17:00'),
  ('a0000000-0000-0000-0000-000000000001', 'evening',   '17:00', '21:00');

-- Sample tasks for Child 1 - morning
insert into tasks (family_id, assigned_to, title, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Brush teeth',       'morning', 5,  1, 1, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Make bed',           'morning', 10, 2, 2, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Reading time',       'morning', 30, 3, 3, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Math practice',      'morning', 20, 4, 2, 'weekdays', current_date);

-- Sample tasks for Child 1 - afternoon
insert into tasks (family_id, assigned_to, title, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Outdoor play',      'afternoon', 60, 1, 2, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Art / creative time','afternoon', 30, 2, 2, 'daily', current_date);

-- Sample tasks for Child 1 - evening
insert into tasks (family_id, assigned_to, title, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Set table for dinner','evening', 10, 1, 1, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Pajamas & brush teeth','evening', 10, 2, 1, 'daily', current_date);

-- Sample tasks for Child 2 - morning
insert into tasks (family_id, assigned_to, title, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Brush teeth',        'morning', 5,  1, 1, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Make bed',            'morning', 10, 2, 2, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Spelling words',      'morning', 20, 3, 2, 'weekdays', current_date);

-- Sample tasks for Child 3 - morning
insert into tasks (family_id, assigned_to, title, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Brush teeth',        'morning', 5,  1, 1, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Get dressed',         'morning', 10, 2, 1, 'daily', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Story time with parent','morning', 15, 3, 2, 'daily', current_date);
