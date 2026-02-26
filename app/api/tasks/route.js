import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(request) {
  const supabase = await getSupabaseServer();
  const { searchParams } = new URL(request.url);

  const familyId = searchParams.get("familyId");
  const assignedTo = searchParams.get("assignedTo");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  let query = supabase.from("tasks").select("*, family_members!assigned_to(name)");

  if (familyId) query = query.eq("family_id", familyId);
  if (assignedTo) query = query.eq("assigned_to", assignedTo);
  query = query.eq("task_date", date).order("day_section").order("sort_order");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = await getSupabaseServer();
  const body = await request.json();

  const { data, error } = await supabase.from("tasks").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request) {
  const supabase = await getSupabaseServer();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request) {
  const supabase = await getSupabaseServer();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
