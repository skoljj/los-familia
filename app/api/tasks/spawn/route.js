import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST(request) {
  const supabase = await getSupabaseServer();
  const { date } = await request.json().catch(() => ({}));

  const targetDate = date || new Date().toISOString().split("T")[0];

  const { data, error } = await supabase.rpc("spawn_tasks_for_date", {
    target_date: targetDate,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spawned: data, date: targetDate });
}
