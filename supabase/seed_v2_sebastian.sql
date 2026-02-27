-- Sebastian's Weekday Template
-- Assumes seed.sql was already run (family + members exist)
-- Sebastian = b0000000-0000-0000-0000-000000000003

-- Template
insert into schedule_templates (id, family_id, assigned_to, name, day_types, is_default) values
  ('10000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   'b0000000-0000-0000-0000-000000000003',
   'Weekday',
   '{monday,tuesday,wednesday,thursday,friday}',
   true);

-- Schedule Blocks (using c0 prefix for valid hex UUIDs)
insert into schedule_blocks (id, template_id, label, emoji, start_time, end_time, block_type, sort_order) values
  ('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Wake up & Morning Routine', '⏰', '06:30', '07:00', 'routine',    1),
  ('c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Breakfast',                 '🍳', '07:00', '07:30', 'routine',    2),
  ('c0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Leave for School',          '🚗', '07:30', '08:00', 'routine',    3),
  ('c0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'School',                    '🏫', '08:00', '14:15', 'passive',    4),
  ('c0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Drive to Library',          '🚗', '14:15', '14:35', 'passive',    5),
  ('c0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Library',                   '📚', '14:40', '15:10', 'activity',   6),
  ('c0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'Pick up Isla',              '👧', '15:15', '15:15', 'passive',    7),
  ('c0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'Transition / Put Things Away','🏠','15:15', '15:30', 'routine',   8),
  ('c0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', 'Entertainment Screen Time', '🎮', '15:30', '16:00', 'free_time',  9),
  ('c0000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'Educational Tablet Time',   '📱', '16:00', '16:30', 'activity',  10),
  ('c0000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'Physical Activity',         '🏃', '16:30', '17:00', 'activity',  11),
  ('c0000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'Daily Chore',               '🧹', '17:00', '17:10', 'routine',   12),
  ('c0000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'Flex Time',                 '🎨', '17:10', '18:00', 'free_time', 13),
  ('c0000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001', 'Dinner',                    '🍽️','18:00', '18:45', 'routine',   14),
  ('c0000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001', 'Bath & Hygiene',            '🛁', '18:45', '19:05', 'routine',   15),
  ('c0000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001', 'Bedtime Reading',           '📖', '19:05', '19:25', 'routine',   16),
  ('c0000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000001', 'Quiet Settling & Lights Out','🌙','19:25', '19:30', 'routine',   17);

-- Tasks within blocks (matching Skylight's actual tasks for Sebastian)
-- Morning Routine block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Wake at 6:30',              '⏰', 'c0000000-0000-0000-0000-000000000001', 'morning', 5,  1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Get dressed',               '👕', 'c0000000-0000-0000-0000-000000000001', 'morning', 5,  2, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Brush hair',                '💇', 'c0000000-0000-0000-0000-000000000001', 'morning', 5,  3, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Make bed',                  '🛏️', 'c0000000-0000-0000-0000-000000000001', 'morning', 5,  4, 1, 'weekdays', current_date);

-- Breakfast block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Eat full breakfast',        '🍳', 'c0000000-0000-0000-0000-000000000002', 'morning', 25, 1, 1, 'weekdays', current_date);

-- Leave for School block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Wash hands & Brush teeth',  '🪥', 'c0000000-0000-0000-0000-000000000003', 'morning', 5,  1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Backpack, water, school materials','🎒','c0000000-0000-0000-0000-000000000003', 'morning', 5, 2, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'In car at 7:35',            '🚐', 'c0000000-0000-0000-0000-000000000003', 'morning', 5,  3, 1, 'weekdays', current_date);

-- Library block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Writing practice',          '✏️', 'c0000000-0000-0000-0000-000000000006', 'afternoon', 10, 1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Reading practice',          '📖', 'c0000000-0000-0000-0000-000000000006', 'afternoon', 10, 2, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Math practice',             '🔢', 'c0000000-0000-0000-0000-000000000006', 'afternoon', 10, 3, 1, 'weekdays', current_date);

-- Transition block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Put backpack & school stuff away','🎒','c0000000-0000-0000-0000-000000000008', 'afternoon', 5, 1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Bathroom + Wash hands',     '🙌', 'c0000000-0000-0000-0000-000000000008', 'afternoon', 5, 2, 1, 'weekdays', current_date);

-- Daily Chore block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Daily chore',               '🧹', 'c0000000-0000-0000-0000-000000000012', 'evening', 10, 1, 1, 'weekdays', current_date);

-- Dinner block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Dinner with great manners', '🍽️', 'c0000000-0000-0000-0000-000000000014', 'evening', 40, 1, 1, 'weekdays', current_date);

-- Bath & Hygiene block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Use bathroom + Wash hands', '🚽', 'c0000000-0000-0000-0000-000000000015', 'evening', 5,  1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Dirty clothes away',        '🧺', 'c0000000-0000-0000-0000-000000000015', 'evening', 3,  2, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Brush teeth',               '🪥', 'c0000000-0000-0000-0000-000000000015', 'evening', 5,  3, 1, 'weekdays', current_date);

-- Bedtime Reading block
insert into tasks (family_id, assigned_to, title, icon, schedule_block_id, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Put on pajamas & pull-up',  '👘', 'c0000000-0000-0000-0000-000000000016', 'evening', 5,  1, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Pick tomorrow''s clothes',  '👕', 'c0000000-0000-0000-0000-000000000016', 'evening', 3,  2, 1, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Bedtime story',             '📚', 'c0000000-0000-0000-0000-000000000016', 'evening', 15, 3, 1, 'weekdays', current_date);

-- Bonus tasks (not tied to a specific block)
insert into tasks (family_id, assigned_to, title, icon, day_section, time_allowed_minutes, sort_order, star_value, repeat, task_date) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Independent success',       '🏆', 'evening', 0, 90, 5, 'weekdays', current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Stay in your bed all night','🛏️', 'evening', 0, 91, 5, 'daily',    current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Read Book #1',              '📚', 'evening', 0, 92, 3, 'daily',    current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Read Book #2',              '📚', 'evening', 0, 93, 3, 'daily',    current_date),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Read Book #3',              '📚', 'evening', 0, 94, 3, 'daily',    current_date);
