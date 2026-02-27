"use client";

import { useState } from "react";
import { formatTimeRange, minutesToDisplay } from "@/lib/time-utils";
import TaskCard from "./TaskCard";
import LightsOutCard from "./LightsOutCard";

const PHASE_STYLES = {
  past: "opacity-50",
  now: "ring-2 ring-blue-400 shadow-lg",
  next: "ring-1 ring-amber-300",
  later: "opacity-80",
};

const BLOCK_TYPE_BG = {
  routine: "bg-white",
  activity: "bg-white",
  free_time: "bg-gradient-to-r from-green-50 to-emerald-50",
  passive: "bg-gray-50",
};

export default function ScheduleBlockCard({
  block,
  tasks,
  isParent,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasTasks = tasks && tasks.length > 0;
  const timeRange = formatTimeRange(block.start_time, block.end_time);
  const completedCount = tasks?.filter(
    (t) => t.status === "done" || t.status === "accepted"
  ).length || 0;

  if (block.label === "Lights Out") {
    return <LightsOutCard block={block} />;
  }

  return (
    <div
      className={`rounded-2xl border transition-all ${
        BLOCK_TYPE_BG[block.block_type] || "bg-white"
      } ${PHASE_STYLES[block.phase] || ""}`}
    >
      {/* Block header — tappable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left min-h-[56px] active:bg-black/5 rounded-2xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{block.emoji || "📅"}</span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">
              {block.label}
            </h3>
            <p className="text-xs text-muted-foreground">{timeRange}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasTasks && (
            <span className="text-xs text-muted-foreground">
              {completedCount}/{tasks.length}
            </span>
          )}

          {block.phase === "now" && block.remainingMinutes != null && (
            <div className="text-right">
              <p className="text-base font-bold text-blue-600 tabular-nums">
                {minutesToDisplay(block.remainingMinutes)}
              </p>
            </div>
          )}
          {block.phase === "past" && !hasTasks && (
            <span className="text-xs text-muted-foreground">Done</span>
          )}
          {block.phase === "next" && (
            <span className="text-xs font-medium text-amber-600">Up Next</span>
          )}

          <span
            className={`text-muted-foreground transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="px-4 pb-4">
          {block.description && (
            <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">
              {block.description}
            </p>
          )}

          {hasTasks ? (
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  isParent={isParent}
                  onMarkDone={onMarkDone}
                  onUndo={onUndo}
                  onAccept={onAccept}
                  onUnaccept={onUnaccept}
                />
              ))}
            </div>
          ) : block.block_type !== "passive" ? (
            <p className="text-xs text-muted-foreground italic">
              No tasks — free block
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
