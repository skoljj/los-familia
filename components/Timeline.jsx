"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { classifyBlocks, getTodayDayType } from "@/lib/time-utils";
import ScheduleBlockCard from "./ScheduleBlockCard";

export default function Timeline({ memberId, familyId, isParent = false, date }) {
  const [blocks, setBlocks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [now, setNow] = useState(new Date());
  const nowBlockRef = useRef(null);
  const spawnedRef = useRef(false);

  const today = new Date().toISOString().split("T")[0];
  const viewDate = date || today;
  const isViewingPast = viewDate < today;
  const isViewingToday = viewDate === today;

  const canInteract = isViewingToday || (isViewingPast && isParent);

  const loadData = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const viewDateObj = new Date(viewDate + "T12:00:00");
    const dayType = getTodayDayType(viewDateObj);

    const { data: templates } = await supabase
      .from("schedule_templates")
      .select("*")
      .eq("assigned_to", memberId)
      .contains("day_types", [dayType]);

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
        .eq("task_date", viewDate)
        .order("sort_order"),
    ]);

    if (blockData) setBlocks(blockData);

    if ((!taskData || taskData.length === 0) && !spawnedRef.current && viewDate <= today) {
      spawnedRef.current = true;
      try {
        const res = await fetch("/api/tasks/spawn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: viewDate }),
        });
        if (res.ok) {
          const { data: freshTasks } = await supabase
            .from("tasks")
            .select("*")
            .eq("assigned_to", memberId)
            .eq("task_date", viewDate)
            .order("sort_order");
          if (freshTasks) setTasks(freshTasks);
          return;
        }
      } catch {
        // spawn failed
      }
    }

    if (taskData) setTasks(taskData);
  }, [memberId, viewDate, today]);

  useEffect(() => {
    spawnedRef.current = false;
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isViewingToday) return;
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, [isViewingToday]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const channel = supabase
      .channel(`timeline-${memberId}-${viewDate}`)
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
  }, [memberId, viewDate, loadData]);

  useEffect(() => {
    if (nowBlockRef.current && isViewingToday) {
      nowBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [blocks.length, isViewingToday]);

  const classifiedBlocks = isViewingToday
    ? classifyBlocks(blocks, now)
    : isViewingPast
      ? blocks.map((b) => ({ ...b, phase: "past", remainingMinutes: null }))
      : classifyBlocks(blocks, now);

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
    if (!canInteract) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase
      .from("tasks")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", taskId);
    loadData();
  }

  async function handleUndo(taskId) {
    if (!canInteract) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase
      .from("tasks")
      .update({ status: "pending", completed_at: null })
      .eq("id", taskId);
    loadData();
  }

  async function handlePicklistSelect(taskId, value) {
    if (!isParent) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isDeselecting = task.metadata?.selected === value;
    const updatedMetadata = { ...task.metadata };

    if (isDeselecting) {
      delete updatedMetadata.selected;
    } else {
      updatedMetadata.selected = value;
    }

    const selectedOpt = (task.metadata?.options || []).find((o) => o.value === value);
    const earnedPoints = isDeselecting ? 0 : (selectedOpt?.points ?? 0);

    await supabase
      .from("tasks")
      .update({
        metadata: updatedMetadata,
        status: isDeselecting ? "pending" : "done",
        completed_at: isDeselecting ? null : new Date().toISOString(),
        star_value: earnedPoints,
      })
      .eq("id", taskId);
    loadData();
  }

  async function handleAccept(taskId) {
    if (!isParent) return;
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
    if (!isParent) return;
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
        <p className="text-lg">No schedule for this day</p>
        <p className="text-sm mt-1">
          {isViewingPast
            ? "No data recorded for this date."
            : "No template matches. Ask a parent to set one up."}
        </p>
      </div>
    );
  }

  const effectiveParent = canInteract ? isParent : false;
  const childCanInteract = canInteract && !isParent;

  return (
    <div className="space-y-3">
      {templateName && (
        <p className="text-xs text-muted-foreground text-center uppercase tracking-wider font-medium">
          {templateName} Schedule
        </p>
      )}

      {isViewingPast && !isParent && (
        <div className="text-center py-2">
          <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200 font-medium">
            Past day — view only
          </span>
        </div>
      )}

      {classifiedBlocks.map((block) => {
        let yotoPrereqs;

        if (block.label === "Breakfast") {
          const wakeBlock = classifiedBlocks.find(
            (b) => b.label === "Wake Up Routine"
          );
          if (wakeBlock) yotoPrereqs = tasksByBlock[wakeBlock.id] || [];
        }

        if (block.label === "Transition to School") {
          yotoPrereqs = tasksByBlock[block.id] || [];
        }

        const blockForView = isViewingPast
          ? { ...block, phase: "review" }
          : block;

        return (
          <div
            key={block.id}
            ref={block.phase === "now" ? nowBlockRef : null}
          >
            <ScheduleBlockCard
              block={blockForView}
              tasks={tasksByBlock[block.id] || []}
              yotoPrereqs={yotoPrereqs}
              isParent={effectiveParent}
              onMarkDone={childCanInteract || effectiveParent ? handleMarkDone : undefined}
              onUndo={childCanInteract || effectiveParent ? handleUndo : undefined}
              onAccept={effectiveParent ? handleAccept : undefined}
              onUnaccept={effectiveParent ? handleUnaccept : undefined}
              onPicklistSelect={effectiveParent ? handlePicklistSelect : undefined}
              defaultExpanded={
                isViewingPast
                  ? true
                  : block.phase === "now" || block.phase === "next"
              }
            />
          </div>
        );
      })}

      {unattachedTasks.length > 0 && (
        <div className="rounded-2xl border bg-gradient-to-r from-amber-50 to-yellow-50 p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏆</span>
            <h3 className="font-semibold text-sm">Bonus Tasks</h3>
          </div>
          <div className="space-y-2">
            {unattachedTasks.map((task) => (
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
                  {task.status === "pending" && childCanInteract && (
                    <button
                      onClick={() => handleMarkDone(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-gray-300 bg-white active:scale-90 transition-transform"
                    />
                  )}
                  {task.status === "done" && childCanInteract && (
                    <button
                      onClick={() => handleUndo(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-blue-300 bg-blue-100 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-400" />
                    </button>
                  )}
                  {task.status === "done" && effectiveParent && (
                    <button
                      onClick={() => handleAccept(task.id)}
                      className="w-10 h-10 rounded-full border-3 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-600 font-bold active:scale-90 transition-transform"
                    >
                      ✓
                    </button>
                  )}
                  {task.status === "accepted" && (
                    <button
                      onClick={() => effectiveParent && handleUnaccept(task.id)}
                      className={`w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold ${
                        effectiveParent ? "active:scale-90 transition-transform cursor-pointer" : ""
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
