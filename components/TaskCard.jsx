"use client";

import { minutesToDisplay } from "@/lib/time-utils";

export default function TaskCard({
  task,
  index,
  isParent,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
}) {
  const isDone = task.status === "done" || task.status === "accepted";
  const isAccepted = task.status === "accepted";
  const awaitingAccept = task.status === "done" && isParent;
  const isParentInput = task.input_type === "parent";

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all ${
        isAccepted
          ? "bg-emerald-50 border border-emerald-200"
          : task.status === "done"
            ? "bg-amber-50 border border-amber-200"
            : isParentInput
              ? "bg-purple-50/60 border border-purple-100"
              : "bg-blue-50/60 border border-blue-100"
      }`}
    >
      <div className="flex justify-center mb-2">
        <span className="text-4xl">{task.icon || "📋"}</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isDone ? "line-through opacity-60" : ""}`}>
            {index != null ? `${String(index + 1).padStart(2, "0")}. ` : ""}
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {isParentInput && (
              <span className="text-[10px] uppercase tracking-wide text-purple-600 font-medium">
                Parent
              </span>
            )}
            {task.star_value > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                {"⭐".repeat(Math.min(task.star_value, 5))}
                {task.star_value > 1 && (
                  <span className="ml-0.5">{task.star_value}</span>
                )}
              </span>
            )}
            {task.time_allowed_minutes > 0 && (
              <span className="text-xs text-muted-foreground">
                {minutesToDisplay(task.time_allowed_minutes)}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              {task.description}
            </p>
          )}
        </div>

        {/* Toggle circle — every state is tappable to undo */}
        <div className="shrink-0 pt-1">
          {awaitingAccept ? (
            <button
              onClick={() => onAccept?.(task.id)}
              className="w-10 h-10 rounded-full border-3 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg active:scale-90 transition-transform"
              title="Accept & award stars"
            >
              ✓
            </button>
          ) : isAccepted ? (
            <button
              onClick={() => isParent && onUnaccept?.(task.id)}
              className={`w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg ${
                isParent ? "active:scale-90 transition-transform cursor-pointer" : ""
              }`}
              title={isParent ? "Undo acceptance" : ""}
            >
              ✓
            </button>
          ) : task.status === "done" ? (
            <button
              onClick={() => !isParent && onUndo?.(task.id)}
              className={`w-10 h-10 rounded-full border-3 border-blue-300 bg-blue-100 flex items-center justify-center active:scale-90 transition-transform ${
                isParent ? "cursor-default" : "cursor-pointer"
              }`}
              title={!isParent ? "Undo" : ""}
            >
              <div className="w-5 h-5 rounded-full bg-blue-400" />
            </button>
          ) : isParentInput && !isParent ? (
            <div className="w-10 h-10 rounded-full border-3 border-purple-200 bg-purple-50 flex items-center justify-center">
              <span className="text-purple-300 text-sm">🔒</span>
            </div>
          ) : isParentInput && isParent ? (
            <button
              onClick={() => onMarkDone?.(task.id)}
              className="w-10 h-10 rounded-full border-3 border-purple-400 bg-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer hover:border-purple-500"
            >
              <div className="w-0 h-0" />
            </button>
          ) : (
            <button
              onClick={() => !isParent && onMarkDone?.(task.id)}
              className={`w-10 h-10 rounded-full border-3 border-gray-300 bg-white flex items-center justify-center active:scale-90 transition-transform ${
                isParent ? "cursor-default" : "cursor-pointer hover:border-blue-400"
              }`}
            >
              <div className="w-0 h-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
