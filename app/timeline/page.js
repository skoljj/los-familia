"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import NavBar from "@/components/NavBar";
import Timeline from "@/components/Timeline";
import StarCounter from "@/components/StarCounter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimelinePage() {
  const { member, family, loading } = useAuth();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  useEffect(() => {
    if (!family) return;
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("day_sections")
        .select("*")
        .eq("family_id", family.id)
        .order("start_time");
      if (data) setSections(data);
    }
    load();
  }, [family]);

  if (!member || !family) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <main className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hi, {member.name}!</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <StarCounter count={member.star_balance} size="lg" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="current" className="flex-1">
              Right Now
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              Full Day
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <Timeline
              memberId={member.id}
              familyId={family.id}
              isParent={false}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-4 space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="font-semibold capitalize text-lg mb-2">
                  {section.label}
                </h3>
                <AllSectionTasks
                  memberId={member.id}
                  familyId={family.id}
                  section={section}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AllSectionTasks({ memberId, familyId, section }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", memberId)
        .eq("family_id", familyId)
        .eq("day_section", section.label)
        .eq("task_date", new Date().toISOString().split("T")[0])
        .order("sort_order");
      if (data) setTasks(data);
    }
    load();
  }, [memberId, familyId, section.label]);

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            t.status === "accepted"
              ? "bg-emerald-50 border-emerald-200"
              : t.status === "done"
                ? "bg-amber-50 border-amber-200"
                : "bg-white"
          }`}
        >
          <div>
            <span className="font-medium text-sm">{t.title}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {t.time_allowed_minutes}m
            </span>
          </div>
          <span className="text-xs capitalize text-muted-foreground">
            {t.status}
          </span>
        </div>
      ))}
    </div>
  );
}
