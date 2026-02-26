"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function CalendarPage() {
  const { member, family, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const [form, setForm] = useState({
    title: "",
    start_at: "",
    end_at: "",
    color: COLORS[0],
  });

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  const loadEvents = useCallback(async () => {
    if (!family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const startOfWeek = new Date(viewDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("family_id", family.id)
      .gte("start_at", startOfWeek.toISOString())
      .lt("start_at", endOfWeek.toISOString())
      .order("start_at");

    if (data) setEvents(data);
  }, [family, viewDate]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleCreate() {
    if (!form.title.trim() || !form.start_at || !form.end_at) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("calendar_events").insert({
      ...form,
      family_id: family.id,
      created_by: member.id,
    });
    setDialogOpen(false);
    setForm({ title: "", start_at: "", end_at: "", color: COLORS[0] });
    loadEvents();
  }

  async function handleDelete(id) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("calendar_events").delete().eq("id", id);
    loadEvents();
  }

  function navigateWeek(delta) {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + delta * 7);
    setViewDate(d);
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  if (!member || !family) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Family Calendar</h1>
          <Button onClick={() => setDialogOpen(true)}>+ Event</Button>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
            &larr; Prev
          </Button>
          <span className="font-medium text-sm">
            {weekDays[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            &ndash;{" "}
            {weekDays[6].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
            Next &rarr;
          </Button>
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayStr = day.toISOString().split("T")[0];
            const isToday =
              dayStr === new Date().toISOString().split("T")[0];
            const dayEvents = events.filter(
              (e) => e.start_at.split("T")[0] === dayStr
            );

            return (
              <div
                key={dayStr}
                className={`min-h-[120px] rounded-lg border p-2 ${
                  isToday ? "bg-blue-50 border-blue-300" : "bg-white"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isToday ? "text-blue-700" : "text-muted-foreground"
                  }`}
                >
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="text-xs p-1 rounded truncate text-white cursor-pointer"
                      style={{ backgroundColor: ev.color || COLORS[0] }}
                      title={ev.title}
                      onClick={() => handleDelete(ev.id)}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Soccer practice"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start</Label>
                  <Input
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(e) =>
                      setForm({ ...form, start_at: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>End</Label>
                  <Input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) =>
                      setForm({ ...form, end_at: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-1">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`w-8 h-8 rounded-full border-2 ${
                        form.color === c
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setForm({ ...form, color: c })}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
