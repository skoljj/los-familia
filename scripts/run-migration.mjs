#!/usr/bin/env node
/**
 * Run a SQL migration file against Supabase using the service role key.
 * Usage: node --env-file=.env.local scripts/run-migration.mjs supabase/migrations/003_xxx.sql
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node --env-file=.env.local scripts/run-migration.mjs <sql-file>");
  process.exit(1);
}

const sql = readFileSync(resolve(file), "utf-8");
const supabase = createClient(url, key);

const { data, error } = await supabase.rpc("exec_sql", { sql_string: sql });

if (error) {
  console.error("Migration failed:", error.message);
  console.log("\nNote: If 'exec_sql' function doesn't exist, run this in the SQL Editor first:");
  console.log(`
create or replace function exec_sql(sql_string text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql_string;
end;
$$;
  `);
  process.exit(1);
}

console.log("Migration applied successfully.");
