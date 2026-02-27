"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { classifyBlocks, getTodayDayType } from "@/lib/time-utils";
import ScheduleBlockCard from "./ScheduleBlockCard";

export default function Timeline({ memberId, familyId, isParent = false }) {
  const [blocks, setBlocks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [now, setNow] = useState(new Date());
  const nowBlockRef = useRef(null);

  const loadData = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const todayType = getTodayDayType();
    const today = new Date().toISOString().split("T")[0];

    const { data: templates } = await supabase
      .from("schedule_templates")
      .select("*")
      .eq("assigned_to", memberId)
      .contains("day_types", [todayType]);

    const template = templates?.[0];

    if (!template) {
      setBlocks([]);
      setTasks([]);
      setTemplateName("");
      return;
    }

    setTemplateName(template.name);

    const [{ data: blockData }, { data: taskData }] = await Promise.all([
      supabase
        .from("schedule_blocks")
        .select("*")
        .eq("template_id", template.id)
        .order("sort_order"),
      supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", memberId)
        .eq("task_date", today)
        .order("sort_order"),
    ]);

    if (blockData) setBlocks(blockData);
    if (taskData) setTasks(taskData);
  }, [memberId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const channel = supabase
      .channel(`timeline-${memberId}`)
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
      const sb = getSupabaseBrowser();
      if (sb) sb.removeChannel(channel);
    };
  }, [memberId, loadData]);

  useEffect(() => {
    if (nowBlockRef.current) {
      nowBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [blocks.length]);

  const classifiedBlocks = classifyBlocks(blocks, now);

  const tasksByBlock = {};
  const unattachedTasks = [];
  for (const task of tasks) {
    if (task.schedule_block_id) {
      if (!tasksByBlock[task.schedule_block_id]) {
        tasksByBlock[task.schedule_block_id] = [];
      }
      tasksByBlock[task.schedule_block_id].push(task);
    } else {
      unattachedTasks.push(task);
    }
  }

  async function handleMarkDone(taskId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase
      .from("tasks")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", taskId);
    loadData();
  }

  async function handleUndo(taskId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase
      .from("tasks")
      .update({ status: "pending", completed_at: null })
      .eq("id", taskId);
    loadData();
  }

  async function handleAccept(taskId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await supabase
      .from("tasks")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
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

  async function handleUnaccept(taskId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await supabase
      .from("tasks")
      .update({ status: "done", accepted_at: null })
      .eq("id", taskId);

    await supabase
      .from("star_ledger")
      .delete()
      .eq("task_id", taskId)
      .eq("member_id", memberId);

    await supabase.rpc("increment_stars", {
      member_uuid: memberId,
      amount: -task.star_value,
    });

    loadData();
  }

  if (classifiedBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No schedule for today</p>
        <p className="text-sm mt-1">
          No template matches today. Ask a parent to set one up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {templateName && (
        <p className="text-xs text-muted-foreground text-center uppercase tracking-wider font-medium">
          {templateName} Schedule
        </p>
      )}

      {classifiedBlocks.map((block) => {
        let yotoPrereqs;

        if (block.label === "Breakfast") {
          const wakeBlock = classifiedBlocks.find(
            (b) => b.label === "Wake Up Routine"
          );
          if (wakeBlock) yotoPrereqs = tasksByBlock[wakeBlock.id] || [];
        }

        if (block.label === "School") {
          const transBlock = classifiedBlocks.find(
            (b) => b.label === "Transition to School"
          );
          if (transBlock) yotoPrereqs = tasksByBlock[transBlock.id] || [];
        }

        return (
          <div
            key={block.id}
            ref={block.phase === "now" ? nowBlockRef : null}
          >
            <ScheduleBlockCard
              block={block}
              tasks={tasksByBlock[block.id] || []}
              yotoPrereqs={yotoPrereqs}
              isParent={isParent}
              onMarkDone={handleMarkDone}
              onUndo={handleUndo}
              onAccept={handleAccept}
              onUnaccept={handleUnaccept}
              defaultExpanded={block.phase === "now" || block.phase === "next"}
            />
          </div>
        );
      })}

      {/* Bonus / unattached tasks */}
      {unattachedTasks.length > 0 && (
        <div className="rounded-2xl border bg-gradient-to-r from-amber-50 to-yellow-50 p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏆</span>
            <h3 className="font-semibold text-sm">Bonus Tasks</h3>
          </div>
          <div className="space-y-2">
            {unattachedTasks.map((task, i) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  task.status === "accepted"
                    ? "bg-emerald-50 border border-emerald-200"
                    : task.status === "done"
                      ? "bg-amber-100/50 border border-amber-200"
                      : "bg-white border border-amber-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{task.icon || "⭐"}</span>
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {"⭐".repeat(Math.min(task.star_value, 5))} {task.star_value}
                    </p>
                  </div>
                </div>
                <div>
                  {task.status === "pending" && !isParent && (
                    <button
                      onClick={() => handleMarkDone(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-gray-300 bg-white active:scale-90 transition-transform"
                    />
                  )}
                  {task.status === "done" && !isParent && (
                    <button
                      onClick={() => handleUndo(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-blue-300 bg-blue-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-400" />
                    </button>
                  )}
                  {task.status === "done" && isParent && (
                    <button
                      onClick={() => handleAccept(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-600 font-bold active:scale-90 transition-transform"
                    >
                      ✓
                    </button>
                  )}
                  {task.status === "accepted" && (
                    <button
                      onClick={() => isParent && handleUnaccept(task.id)}
                      className={`w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold ${
                        isParent ? "active:scale-90 transition-transform cursor-pointer" : ""
                      }`}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
