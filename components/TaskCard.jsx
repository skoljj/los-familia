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
  onPicklistSelect,
}) {
  const isDone = task.status === "done" || task.status === "accepted";
  const isAccepted = task.status === "accepted";
  const awaitingAccept = task.status === "done" && isParent;
  const isParentInput = task.input_type === "parent";

  const isPicklist = task.metadata?.type === "picklist";
  const picklistOptions = task.metadata?.options || [];
  const selectedValue = task.metadata?.selected;

  if (isPicklist) {
    return (
      <PicklistCard
        task={task}
        index={index}
        isParent={isParent}
        options={picklistOptions}
        selectedValue={selectedValue}
        onSelect={onPicklistSelect}
      />
    );
  }

  const statusBg = isAccepted
    ? "bg-emerald-50 border border-emerald-200"
    : task.status === "done"
      ? "bg-amber-50 border border-amber-200"
      : isParentInput
        ? "bg-purple-50/60 border border-purple-100"
        : "bg-blue-50/60 border border-blue-100";

  const toggle = (
    <div className="shrink-0">
      {awaitingAccept ? (
        <button
          onClick={() => onAccept?.(task.id)}
          className="w-10 h-10 md:w-9 md:h-9 rounded-full border-3 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg active:scale-90 transition-transform"
          title="Accept & award stars"
        >
          ✓
        </button>
      ) : isAccepted ? (
        <button
          onClick={() => isParent && onUnaccept?.(task.id)}
          className={`w-10 h-10 md:w-9 md:h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg ${
            isParent ? "active:scale-90 transition-transform cursor-pointer" : ""
          }`}
          title={isParent ? "Undo acceptance" : ""}
        >
          ✓
        </button>
      ) : task.status === "done" ? (
        <button
          onClick={() => !isParent && onUndo?.(task.id)}
          className={`w-10 h-10 md:w-9 md:h-9 rounded-full border-3 border-blue-300 bg-blue-100 flex items-center justify-center active:scale-90 transition-transform ${
            isParent ? "cursor-default" : "cursor-pointer"
          }`}
          title={!isParent ? "Undo" : ""}
        >
          <div className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-blue-400" />
        </button>
      ) : isParentInput && !isParent ? (
        <div className="w-10 h-10 md:w-9 md:h-9 rounded-full border-3 border-purple-200 bg-purple-50 flex items-center justify-center">
          <span className="text-purple-300 text-sm">🔒</span>
        </div>
      ) : isParentInput && isParent ? (
        <button
          onClick={() => onMarkDone?.(task.id)}
          className="w-10 h-10 md:w-9 md:h-9 rounded-full border-3 border-purple-400 bg-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer hover:border-purple-500"
        >
          <div className="w-0 h-0" />
        </button>
      ) : (
        <button
          onClick={() => !isParent && onMarkDone?.(task.id)}
          className={`w-10 h-10 md:w-9 md:h-9 rounded-full border-3 border-gray-300 bg-white flex items-center justify-center active:scale-90 transition-transform ${
            isParent ? "cursor-default" : "cursor-pointer hover:border-blue-400"
          }`}
        >
          <div className="w-0 h-0" />
        </button>
      )}
    </div>
  );

  return (
    <div className={`relative rounded-2xl md:rounded-xl transition-all ${statusBg}`}>
      {/* Portrait / small screens: vertical card */}
      <div className="p-4 md:hidden">
        <div className="flex justify-center mb-2">
          <span className="text-4xl">{task.icon || "📋"}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${isDone ? "line-through opacity-60" : ""}`}>
              {index != null ? `${String(index + 1).padStart(2, "0")}. ` : ""}
              {task.title}
            </p>
            <Meta task={task} isParentInput={isParentInput} />
          </div>
          {toggle}
        </div>
      </div>

      {/* Landscape / wide screens: compact horizontal row */}
      <div className="hidden md:flex items-center gap-3 px-3 py-2.5">
        <span className="text-2xl shrink-0">{task.icon || "📋"}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm leading-tight ${isDone ? "line-through opacity-60" : ""}`}>
            {index != null ? `${String(index + 1).padStart(2, "0")}. ` : ""}
            {task.title}
          </p>
          <Meta task={task} isParentInput={isParentInput} />
        </div>
        {toggle}
      </div>
    </div>
  );
}

const VALUE_COLORS = {
  green:   { bg: "bg-emerald-50 border border-emerald-200", btn: "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300" },
  on_time: { bg: "bg-emerald-50 border border-emerald-200", btn: "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300" },
  yellow:  { bg: "bg-amber-50 border border-amber-200",     btn: "bg-amber-500 text-white shadow-md ring-2 ring-amber-300" },
  ok:      { bg: "bg-amber-50 border border-amber-200",     btn: "bg-amber-500 text-white shadow-md ring-2 ring-amber-300" },
  red:     { bg: "bg-red-50 border border-red-200",         btn: "bg-red-600 text-white shadow-md ring-2 ring-red-300" },
  late:    { bg: "bg-red-50 border border-red-200",         btn: "bg-red-600 text-white shadow-md ring-2 ring-red-300" },
  unknown: { bg: "bg-gray-50 border border-gray-200",       btn: "bg-gray-500 text-white shadow-md ring-2 ring-gray-300" },
};
const DEFAULT_SELECTED = { bg: "bg-gray-50 border border-gray-200", btn: "bg-purple-600 text-white shadow-md ring-2 ring-purple-300" };

function PicklistCard({ task, index, isParent, options, selectedValue, onSelect }) {
  const selectedOption = options.find((o) => o.value === selectedValue);
  const hasSelection = !!selectedValue;
  const hasPoints = options.some((o) => o.points != null);

  const palette = hasSelection
    ? VALUE_COLORS[selectedValue] || DEFAULT_SELECTED
    : null;
  const bgColor = palette?.bg || "bg-purple-50/60 border border-purple-100";

  function btnClass(opt) {
    if (selectedValue !== opt.value) {
      return "bg-white border border-purple-200 text-purple-800 hover:border-purple-400";
    }
    return (VALUE_COLORS[opt.value] || DEFAULT_SELECTED).btn;
  }

  return (
    <div className={`relative rounded-2xl md:rounded-xl transition-all ${bgColor}`}>
      {/* Portrait */}
      <div className="p-4 md:hidden">
        <div className="flex justify-center mb-2">
          <span className="text-4xl">{task.icon || "📋"}</span>
        </div>
        <p className="font-medium text-center mb-3">
          {index != null ? `${String(index + 1).padStart(2, "0")}. ` : ""}
          {task.title}
        </p>

        {isParent ? (
          <div className={`grid ${options.length <= 3 ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect?.(task.id, opt.value)}
                className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${btnClass(opt)}`}
              >
                <span className="text-lg">{opt.emoji}</span>
                <span className="text-xs truncate">{opt.label}</span>
                {opt.points != null && (
                  <span className="text-[10px] opacity-70">{opt.points} pts</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            {hasSelection ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border">
                <span className="text-lg">{selectedOption?.emoji}</span>
                <span className="font-semibold text-sm">{selectedOption?.label}</span>
                {selectedOption?.points != null && (
                  <span className="text-xs opacity-60">+{selectedOption.points}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-purple-300">
                <span className="text-sm">🔒</span>
                <span className="text-xs italic">Waiting for parent</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2 justify-center">
          <span className="text-[10px] uppercase tracking-wide text-purple-600 font-medium">
            Parent
          </span>
        </div>
      </div>

      {/* Landscape */}
      <div className="hidden md:block px-3 py-2.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl shrink-0">{task.icon || "📋"}</span>
          <p className="font-medium text-sm leading-tight">
            {index != null ? `${String(index + 1).padStart(2, "0")}. ` : ""}
            {task.title}
          </p>
          <span className="text-[10px] uppercase tracking-wide text-purple-600 font-medium shrink-0">
            Parent
          </span>
        </div>

        {isParent ? (
          <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelect?.(task.id, opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${btnClass(opt)}`}
                >
                  <span className="text-sm">{opt.emoji}</span>
                  <span>{opt.label}</span>
                  {opt.points != null && (
                    <span className="opacity-70 text-[10px]">({opt.points})</span>
                  )}
                  {isSelected && <span className="ml-0.5">✓</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {hasSelection ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/80 border text-xs font-semibold">
                <span className="text-sm">{selectedOption?.emoji}</span>
                {selectedOption?.label}
                {selectedOption?.points != null && (
                  <span className="opacity-60">+{selectedOption.points}</span>
                )}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-purple-300">
                <span className="text-sm">🔒</span>
                <span className="text-xs italic">Waiting for parent</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Meta({ task, isParentInput }) {
  return (
    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
      {task.description && (
        <span className="text-xs text-muted-foreground italic">
          {task.description}
        </span>
      )}
    </div>
  );
}
