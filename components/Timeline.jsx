"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { buildTimeline, getCurrentSection } from "@/lib/time-utils";
import DaySectionBar from "./DaySectionBar";
import TaskCard from "./TaskCard";

export default function Timeline({ memberId, familyId, isParent = false }) {
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(new Date());

  const supabase = getSupabaseBrowser();

  const loadData = useCallback(async () => {
    const [{ data: sectionData }, { data: taskData }] = await Promise.all([
      supabase
        .from("day_sections")
        .select("*")
        .eq("family_id", familyId)
        .order("start_time"),
      supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", memberId)
        .eq("task_date", new Date().toISOString().split("T")[0])
        .order("sort_order"),
    ]);
    if (sectionData) setSections(sectionData);
    if (taskData) setTasks(taskData);
  }, [supabase, familyId, memberId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`tasks-${memberId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `assigned_to=eq.${memberId}`,
        },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, memberId, loadData]);

  const currentSection = getCurrentSection(sections, now);

  const sectionTasks = tasks.filter(
    (t) => currentSection && t.day_section === currentSection.label
  );

  const timeline = currentSection
    ? buildTimeline(sectionTasks, currentSection.start_time, now)
    : [];

  async function handleMarkDone(taskId) {
    await supabase
      .from("tasks")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", taskId);
    loadData();
  }

  async function handleAccept(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await supabase
      .from("tasks")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    await supabase.from("star_ledger").insert({
      member_id: memberId,
      task_id: taskId,
      stars: task.star_value,
    });

    await supabase.rpc("increment_stars", {
      member_uuid: memberId,
      amount: task.star_value,
    });

    loadData();
  }

  if (!currentSection) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No active section right now</p>
        <p className="text-sm mt-1">Check back during a scheduled section</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DaySectionBar section={currentSection} now={now} />

      <div className="space-y-3">
        {timeline.map((item) => (
          <TaskCard
            key={item.id}
            task={item}
            phase={item.phase}
            remainingMs={item.remainingMs}
            isParent={isParent}
            onMarkDone={handleMarkDone}
            onAccept={handleAccept}
          />
        ))}
      </div>

      {timeline.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No tasks for this section
        </p>
      )}
    </div>
  );
}
