"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { localDateString } from "@/lib/time-utils";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import NavBar from "@/components/NavBar";
import Timeline from "@/components/Timeline";
import FamilyMemberPicker from "@/components/FamilyMemberPicker";
import StarCounter from "@/components/StarCounter";
import DateNavigator from "@/components/DateNavigator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const { member, family, loading, isParent } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => localDateString());
  const [stats, setStats] = useState({ totalTasks: 0, completed: 0, accepted: 0 });

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
    if (!loading && member && !isParent) router.replace("/timeline");
  }, [member, loading, isParent, router]);

  const loadChildren = useCallback(async () => {
    if (!family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("family_members")
      .select("*")
      .eq("family_id", family.id)
      .eq("role", "child")
      .order("name");
    if (data) {
      setChildren(data);
      if (!selectedChild && data.length > 0) {
        setSelectedChild(data[0].id);
      }
    }
  }, [family, selectedChild]);

  const loadStats = useCallback(async () => {
    if (!family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("tasks")
      .select("status")
      .eq("family_id", family.id)
      .eq("task_date", selectedDate);

    if (data) {
      setStats({
        totalTasks: data.length,
        completed: data.filter((t) => t.status === "done" || t.status === "accepted").length,
        accepted: data.filter((t) => t.status === "accepted").length,
      });
    }
  }, [family, selectedDate]);

  useEffect(() => {
    loadChildren();
    loadStats();
  }, [loadChildren, loadStats]);

  useEffect(() => {
    if (!family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const channel = supabase
      .channel("dashboard-tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          loadStats();
          loadChildren();
        }
      )
      .subscribe();

    return () => {
      const sb = getSupabaseBrowser();
      if (sb) sb.removeChannel(channel);
    };
  }, [family, loadStats, loadChildren]);

  if (!member || !family) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <DateNavigator
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isParent={true}
      />
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Family Dashboard</h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{stats.accepted}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Child star balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Star Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {children.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{child.name}</span>
                  <StarCounter count={child.star_balance} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Child timeline viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Child Timelines</h2>
            <FamilyMemberPicker
              members={children}
              selectedId={selectedChild}
              onSelect={setSelectedChild}
            />
          </div>

          {selectedChild && (
            <div className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-full">
              <Timeline
                key={`${selectedChild}-${selectedDate}`}
                memberId={selectedChild}
                familyId={family.id}
                isParent={true}
                date={selectedDate}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
