import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(request) {
  const supabase = await getSupabaseServer();
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return NextResponse.json({ error: "memberId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("star_ledger")
    .select("*, tasks(title)")
    .eq("member_id", memberId)
    .order("earned_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = await getSupabaseServer();
  const body = await request.json();
  const { member_id, task_id, stars } = body;

  const { data, error } = await supabase
    .from("star_ledger")
    .insert({ member_id, task_id, stars })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.rpc("increment_stars", {
    member_uuid: member_id,
    amount: stars,
  });

  return NextResponse.json(data, { status: 201 });
}
