"use client";

import { useState } from "react";
import { formatTimeRange, minutesToDisplay } from "@/lib/time-utils";
import TaskCard from "./TaskCard";

const THEMES = {
  "Wake Up Routine": {
    bg: "from-amber-300 via-orange-200 to-yellow-100",
    hero: "🌅",
    heroSize: "text-[64px]",
    accent: "text-amber-800",
    accentMuted: "text-amber-700/70",
    badge: "bg-amber-600/20 text-amber-800 border-amber-400/30",
    taskBorder: "border-amber-200",
    scene: "sunrise",
  },
  Breakfast: {
    bg: "from-orange-100 via-amber-50 to-yellow-50",
    hero: "🍳",
    heroSize: "text-[64px]",
    accent: "text-orange-800",
    accentMuted: "text-orange-700/70",
    badge: "bg-orange-500/20 text-orange-800 border-orange-300/30",
    taskBorder: "border-orange-200",
    scene: "kitchen",
  },
  "Transition to School": {
    bg: "from-sky-200 via-blue-100 to-cyan-50",
    hero: "🚗",
    heroSize: "text-[64px]",
    accent: "text-sky-800",
    accentMuted: "text-sky-700/70",
    badge: "bg-sky-500/20 text-sky-800 border-sky-300/30",
    taskBorder: "border-sky-200",
    scene: "checklist",
  },
  School: {
    bg: "from-blue-300 via-sky-200 to-blue-100",
    hero: "🏫",
    heroSize: "text-[72px]",
    accent: "text-blue-900",
    accentMuted: "text-blue-700/70",
    badge: "bg-blue-500/20 text-blue-900 border-blue-400/30",
    taskBorder: "border-blue-200",
    scene: "school",
  },
  "Transition From School": {
    bg: "from-fuchsia-300 via-pink-200 to-amber-100",
    hero: "🎉",
    heroSize: "text-[72px]",
    accent: "text-fuchsia-900",
    accentMuted: "text-fuchsia-700/70",
    badge: "bg-fuchsia-500/20 text-fuchsia-900 border-fuchsia-300/30",
    taskBorder: "border-fuchsia-200",
    scene: "celebration",
  },
  Academics: {
    bg: "from-teal-200 via-emerald-100 to-cyan-50",
    hero: "🧠",
    heroSize: "text-[64px]",
    accent: "text-teal-800",
    accentMuted: "text-teal-700/70",
    badge: "bg-teal-500/20 text-teal-800 border-teal-300/30",
    taskBorder: "border-teal-200",
    scene: "focus",
  },
  "Pick up Isla": {
    bg: "from-pink-200 via-rose-100 to-pink-50",
    hero: "👧",
    heroSize: "text-[64px]",
    accent: "text-pink-800",
    accentMuted: "text-pink-700/60",
    badge: "bg-pink-400/20 text-pink-800 border-pink-300/30",
    taskBorder: "border-pink-200",
    scene: null,
  },
  "Transition / Put Things Away": {
    bg: "from-slate-200 via-stone-100 to-gray-50",
    hero: "🏠",
    heroSize: "text-[64px]",
    accent: "text-slate-800",
    accentMuted: "text-slate-600/70",
    badge: "bg-slate-400/20 text-slate-800 border-slate-300/30",
    taskBorder: "border-slate-200",
    scene: null,
  },
  "Screen Time": {
    bg: "from-violet-300 via-purple-200 to-indigo-100",
    hero: "📺",
    heroSize: "text-[64px]",
    accent: "text-violet-900",
    accentMuted: "text-violet-700/70",
    badge: "bg-violet-500/20 text-violet-900 border-violet-300/30",
    taskBorder: "border-violet-200",
    scene: "digital",
  },
  "Physical Fun": {
    bg: "from-green-300 via-emerald-200 to-lime-100",
    hero: "⚽",
    heroSize: "text-[72px]",
    accent: "text-green-900",
    accentMuted: "text-green-700/70",
    badge: "bg-green-500/20 text-green-900 border-green-300/30",
    taskBorder: "border-green-200",
    scene: "outdoor",
  },
  "Daily Chore": {
    bg: "from-amber-200 via-yellow-100 to-orange-50",
    hero: "🦸",
    heroSize: "text-[64px]",
    accent: "text-amber-800",
    accentMuted: "text-amber-700/70",
    badge: "bg-amber-500/20 text-amber-800 border-amber-300/30",
    taskBorder: "border-amber-200",
    scene: null,
  },
  "Kids Choice": {
    bg: "from-rose-200 via-pink-100 to-amber-100",
    hero: "🌈",
    heroSize: "text-[72px]",
    accent: "text-rose-900",
    accentMuted: "text-rose-700/70",
    badge: "bg-rose-500/20 text-rose-900 border-rose-300/30",
    taskBorder: "border-rose-200",
    scene: "rainbow",
  },
  Dinner: {
    bg: "from-orange-200 via-red-100 to-amber-50",
    hero: "🍽️",
    heroSize: "text-[64px]",
    accent: "text-orange-900",
    accentMuted: "text-orange-700/70",
    badge: "bg-orange-500/20 text-orange-900 border-orange-300/30",
    taskBorder: "border-orange-200",
    scene: "warm",
  },
  "Night Hygiene": {
    bg: "from-cyan-200 via-sky-100 to-blue-50",
    hero: "🛁",
    heroSize: "text-[64px]",
    accent: "text-cyan-800",
    accentMuted: "text-cyan-700/70",
    badge: "bg-cyan-500/20 text-cyan-800 border-cyan-300/30",
    taskBorder: "border-cyan-200",
    scene: "bubbles",
  },
  "Night Transition": {
    bg: "from-indigo-300 via-purple-200 to-violet-100",
    hero: "🌜",
    heroSize: "text-[64px]",
    accent: "text-indigo-900",
    accentMuted: "text-indigo-700/70",
    badge: "bg-indigo-400/20 text-indigo-900 border-indigo-300/30",
    taskBorder: "border-indigo-200",
    scene: "dusk",
  },
  "Bedtime Story": {
    bg: "from-amber-200 via-orange-100 to-yellow-50",
    hero: "📖",
    heroSize: "text-[64px]",
    accent: "text-amber-900",
    accentMuted: "text-amber-700/70",
    badge: "bg-amber-400/20 text-amber-900 border-amber-300/30",
    taskBorder: "border-amber-200",
    scene: "lamplight",
  },
};

function SceneElements({ scene }) {
  if (scene === "sunrise") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-yellow-300/30 blur-2xl" />
        <div className="absolute top-3 left-4 text-lg animate-float-slow">☁️</div>
        <div className="absolute top-5 right-6 text-sm animate-float-slower">☁️</div>
        <div className="absolute bottom-2 right-4 text-xs opacity-60">🐦</div>
      </div>
    );
  }
  if (scene === "kitchen") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-5 text-lg">🎵</div>
        <div className="absolute top-4 right-5 text-sm opacity-70 animate-float-slow">♨️</div>
        <div className="absolute bottom-3 left-4 text-sm">🧃</div>
        <div className="absolute bottom-2 right-5 text-xs">🥞</div>
      </div>
    );
  }
  if (scene === "checklist") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 right-4 text-lg animate-bounce-gentle">✅</div>
        <div className="absolute top-5 left-5 text-sm opacity-60">📋</div>
        <div className="absolute bottom-3 left-6 text-xs">⏰</div>
        <div className="absolute bottom-2 right-3 text-lg">💨</div>
      </div>
    );
  }
  if (scene === "school") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-5 text-sm opacity-70">📝</div>
        <div className="absolute top-4 right-5 text-sm opacity-60 animate-float-slow">✏️</div>
        <div className="absolute bottom-3 right-4 text-xs">🔔</div>
        <div className="absolute bottom-2 left-4 text-xs">📐</div>
      </div>
    );
  }
  if (scene === "celebration") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${8 + (i * 41) % 84}%`,
              top: `${10 + (i * 29) % 60}%`,
              animationDelay: `${i * 0.2}s`,
              fontSize: 10 + (i % 3) * 4,
            }}
          >
            {["🎊", "🍿", "🎵", "⭐", "🎶", "🥳"][i % 6]}
          </div>
        ))}
        <div className="absolute top-3 left-5 text-2xl animate-bounce-gentle">🎧</div>
        <div className="absolute top-4 right-5 text-xl animate-float-slow">🍎</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-fuchsia-700 tracking-widest uppercase animate-pulse">
          Freedom!
        </div>
      </div>
    );
  }
  if (scene === "focus") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-5 text-sm animate-float-slow">✏️</div>
        <div className="absolute top-4 right-5 text-sm opacity-70">📚</div>
        <div className="absolute bottom-3 right-4 text-xs">🔢</div>
        <div className="absolute bottom-2 left-4 text-lg opacity-50">💡</div>
      </div>
    );
  }
  if (scene === "digital") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 right-5 text-lg animate-float-slow">🎮</div>
        <div className="absolute top-4 left-5 text-sm opacity-70">📱</div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400/20 animate-float-slower"
            style={{
              width: 6 + i * 3,
              height: 6 + i * 3,
              left: `${20 + i * 18}%`,
              bottom: `${10 + (i * 13) % 30}%`,
            }}
          />
        ))}
      </div>
    );
  }
  if (scene === "outdoor") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 right-5 text-2xl">☀️</div>
        <div className="absolute top-4 left-5 text-sm animate-float-slow">🌳</div>
        <div className="absolute bottom-3 right-5 text-sm">🏃</div>
        <div className="absolute bottom-2 left-5 text-xs animate-bounce-gentle">⚾</div>
        <div className="absolute bottom-4 left-1/3 text-xs">🚴</div>
      </div>
    );
  }
  if (scene === "rainbow") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["📖", "🌳", "🎲", "🧩", "⚾", "🎨"].map((e, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${5 + i * 15}%`,
              top: `${15 + (i * 23) % 50}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: 14 + (i % 2) * 6,
              opacity: 0.7,
            }}
          >
            {e}
          </div>
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-600 uppercase tracking-widest">
          Your Choice!
        </div>
      </div>
    );
  }
  if (scene === "warm") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-5 text-sm animate-float-slow">🕯️</div>
        <div className="absolute top-4 right-5 text-sm opacity-70">♨️</div>
        <div className="absolute bottom-3 right-4 text-xs">👨‍👩‍👧‍👦</div>
        <div className="absolute bottom-2 left-5 text-xs">🥗</div>
      </div>
    );
  }
  if (scene === "bubbles") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-300/40 bg-cyan-200/20 animate-bubble-up"
            style={{
              width: 8 + (i % 4) * 6,
              height: 8 + (i % 4) * 6,
              left: `${10 + (i * 31) % 80}%`,
              bottom: -10,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2.5 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
        <div className="absolute top-3 right-5 text-lg opacity-70">🫧</div>
        <div className="absolute top-4 left-5 text-sm animate-float-slow">✨</div>
      </div>
    );
  }
  if (scene === "dusk") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 right-6 text-xl">🌙</div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-twinkle-star"
            style={{
              width: 3,
              height: 3,
              top: `${15 + (i * 17) % 40}%`,
              left: `${10 + (i * 23) % 70}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (scene === "lamplight") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 right-5 text-xl">💡</div>
        <div className="absolute -bottom-4 right-6 w-32 h-32 rounded-full bg-amber-200/20 blur-2xl" />
        <div className="absolute top-4 left-5 text-sm opacity-60 animate-float-slow">✨</div>
        <div className="absolute bottom-3 left-5 text-xs">📚</div>
      </div>
    );
  }
  return null;
}

function YotoBadge({ tasks }) {
  const morningTasks = tasks || [];
  const allDone = morningTasks.length > 0 && morningTasks.every(
    (t) => t.status === "done" || t.status === "accepted"
  );
  if (!allDone) return null;
  return (
    <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/40 rounded-full px-3 py-1 mt-1 animate-bounce-gentle">
      <span className="text-sm">🎧</span>
      <span className="text-xs font-bold text-green-800">Yoto Earned!</span>
    </div>
  );
}

export default function ImmersiveBlockCard({
  block,
  tasks,
  morningTasks,
  isParent,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = THEMES[block.label];
  const hasTasks = tasks && tasks.length > 0;
  const timeRange = formatTimeRange(block.start_time, block.end_time);
  const completedCount =
    tasks?.filter((t) => t.status === "done" || t.status === "accepted")
      .length || 0;

  if (!theme) return null;

  const isPast = block.phase === "past";
  const isNow = block.phase === "now";
  const isNext = block.phase === "next";

  return (
    <div
      className={`rounded-3xl overflow-hidden transition-all ${
        isPast ? "opacity-50" : ""
      } ${isNow ? "ring-2 ring-blue-400 shadow-lg" : ""} ${
        isNext ? "ring-1 ring-amber-300" : ""
      } ${!isNow && !isPast && !isNext ? "opacity-90" : ""}`}
    >
      {/* Hero banner — always visible, tappable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`relative w-full bg-gradient-to-br ${theme.bg} p-5 pb-4 text-left active:brightness-95 transition-all min-h-[120px]`}
      >
        <SceneElements scene={theme.scene} />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className={`${theme.heroSize} leading-none mb-1 drop-shadow`}>
              {block.emoji || theme.hero}
            </div>
            <h3 className={`text-lg font-bold ${theme.accent} leading-tight`}>
              {block.label}
            </h3>
            <p className={`text-xs ${theme.accentMuted} mt-0.5`}>{timeRange}</p>

            {block.label === "Breakfast" && morningTasks && (
              <YotoBadge tasks={morningTasks} />
            )}
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {hasTasks && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${theme.badge}`}
              >
                {completedCount}/{tasks.length}
              </span>
            )}

            {isNow && block.remainingMinutes != null && (
              <span className={`text-base font-bold ${theme.accent} tabular-nums`}>
                {minutesToDisplay(block.remainingMinutes)}
              </span>
            )}
            {isPast && !hasTasks && (
              <span className={`text-xs ${theme.accentMuted}`}>Done</span>
            )}
            {isNext && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded-full">
                Up Next
              </span>
            )}

            <span
              className={`${theme.accentMuted} transition-transform duration-200 text-sm ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </div>
        </div>

        {block.description && (
          <p
            className={`relative z-10 text-xs ${theme.accentMuted} italic mt-2 leading-relaxed`}
          >
            {block.description}
          </p>
        )}
      </button>

      {/* Expandable tasks */}
      {expanded && hasTasks && (
        <div className="bg-white/80 backdrop-blur-sm p-3 space-y-2">
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
      )}

      {expanded && !hasTasks && block.block_type !== "passive" && (
        <div className="bg-white/80 p-4">
          <p className={`text-xs ${theme.accentMuted} italic`}>
            No tasks — free block
          </p>
        </div>
      )}
    </div>
  );
}
