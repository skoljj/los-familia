import { createBrowserClient } from "@supabase/ssr";

let client;

export function getSupabaseBrowser() {
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  if (client) return client;
  client = createBrowserClient(url, key);
  return client;
}
