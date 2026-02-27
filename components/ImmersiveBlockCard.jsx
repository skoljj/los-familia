"use client";

import { useState } from "react";
import { formatTimeRange, minutesToDisplay } from "@/lib/time-utils";
import TaskCard from "./TaskCard";

function StatusPill({ block, hasTasks, completedCount, taskCount }) {
  const isNow = block.phase === "now";
  const isPast = block.phase === "past";
  const isNext = block.phase === "next";

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {hasTasks && (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white">
          {completedCount}/{taskCount}
        </span>
      )}
      {isNow && block.remainingMinutes != null && (
        <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white tabular-nums">
          {minutesToDisplay(block.remainingMinutes)}
        </span>
      )}
      {isPast && (
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white/80">
          Done ✓
        </span>
      )}
      {isNext && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/30 border border-amber-300/40 text-white">
          Up Next
        </span>
      )}
    </div>
  );
}

function YotoMilestone({ prereqTasks, label }) {
  const list = prereqTasks || [];
  if (list.length === 0) return null;
  const allDone = list.every(
    (t) => t.status === "done" || t.status === "accepted"
  );
  if (allDone) {
    return (
      <div className="flex items-center gap-1.5 bg-green-500/30 border border-green-300/40 rounded-full px-3 py-1 mt-2 animate-bounce-gentle backdrop-blur-sm">
        <span className="text-sm">🎧</span>
        <span className="text-xs font-bold text-white">Yoto Unlocked!</span>
      </div>
    );
  }
  const remaining = list.filter(
    (t) => t.status !== "done" && t.status !== "accepted"
  ).length;
  return (
    <div className="flex items-center gap-1.5 bg-black/15 border border-white/15 rounded-full px-3 py-1 mt-2 backdrop-blur-sm">
      <span className="text-sm opacity-50">🎧</span>
      <span className="text-xs text-white/70">{label} — {remaining} left</span>
    </div>
  );
}

/* ── Scene builders ─────────────────────────────────────────── */

function WakeUpScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-amber-300 to-yellow-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[35%]">
        <svg viewBox="0 0 400 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path d="M0,60 Q100,20 200,50 Q300,80 400,40 L400,100 L0,100 Z" fill="#92400e" opacity="0.15" />
          <path d="M0,75 Q80,50 180,70 Q280,90 400,60 L400,100 L0,100 Z" fill="#92400e" opacity="0.1" />
        </svg>
      </div>
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-300/40 blur-3xl" />
      <div className="absolute top-[10%] left-[10%] text-2xl animate-float-slow">☁️</div>
      <div className="absolute top-[15%] right-[8%] text-lg animate-float-slower opacity-70">☁️</div>
      <div className="absolute top-[8%] right-[25%] text-xs animate-float-slow opacity-50">🐦</div>
    </>
  );
}

function BreakfastScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-amber-200 to-orange-100" />
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-amber-800/10" />
      <div className="absolute bottom-[15%] left-[8%] text-3xl">🥞</div>
      <div className="absolute bottom-[15%] right-[8%] text-3xl">🧃</div>
      <div className="absolute top-[8%] left-[12%] text-xl animate-float-slow">♨️</div>
      <div className="absolute top-[12%] right-[15%] text-lg animate-float-slower">🎵</div>
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-sm animate-float-slow opacity-60">♨️</div>
    </>
  );
}

function TransitionToSchoolScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gray-400/20" />
      <svg className="absolute bottom-0 w-full h-[8%]" viewBox="0 0 400 20" preserveAspectRatio="none">
        <rect x="0" y="8" width="400" height="4" fill="#94a3b8" opacity="0.5" />
        <line x1="0" y1="10" x2="400" y2="10" stroke="#fbbf24" strokeWidth="1" strokeDasharray="20,15" />
      </svg>
      <div className="absolute bottom-[12%] right-[10%] text-4xl">🚗</div>
      <div className="absolute top-[8%] left-[8%] text-xl animate-float-slow">☁️</div>
      <div className="absolute top-[12%] right-[12%] text-sm animate-float-slower">☁️</div>
      <div className="absolute top-[6%] left-[35%] text-2xl animate-bounce-gentle">⏰</div>
    </>
  );
}

function SchoolScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-blue-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[30%]">
        <svg viewBox="0 0 400 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <rect x="120" y="30" width="160" height="70" rx="4" fill="#1e3a5f" opacity="0.7" />
          <polygon points="200,5 100,40 300,40" fill="#1e3a5f" opacity="0.8" />
          <rect x="185" y="55" width="30" height="45" rx="2" fill="#92400e" opacity="0.5" />
          <rect x="140" y="50" width="25" height="20" rx="1" fill="#7dd3fc" opacity="0.5" />
          <rect x="235" y="50" width="25" height="20" rx="1" fill="#7dd3fc" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute top-[8%] left-[10%] text-lg animate-float-slow">☁️</div>
      <div className="absolute top-[10%] right-[12%] text-xl animate-float-slower">☁️</div>
      <div className="absolute top-[5%] right-[30%] text-sm animate-float-slow opacity-60">🐦</div>
    </>
  );
}

function TransitionFromSchoolScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-400 via-pink-300 to-amber-200" />
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${5 + (i * 41) % 90}%`,
            top: `${5 + (i * 29) % 70}%`,
            animationDelay: `${i * 0.15}s`,
            fontSize: 14 + (i % 4) * 5,
          }}
        >
          {["🎊", "🍿", "🎵", "⭐", "🎶", "🥳", "🍎", "🎧"][i % 8]}
        </div>
      ))}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-base font-black tracking-[0.2em] uppercase text-white/80 animate-pulse drop-shadow">
        Freedom!
      </div>
    </>
  );
}

function AcademicsScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500 via-emerald-400 to-cyan-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-teal-900/10" />
      <div className="absolute bottom-[18%] left-[10%] text-3xl">📚</div>
      <div className="absolute bottom-[16%] right-[10%] text-3xl">✏️</div>
      <div className="absolute top-[10%] right-[15%] text-2xl animate-float-slow opacity-80">💡</div>
      <div className="absolute top-[8%] left-[12%] text-lg animate-float-slower">🔢</div>
    </>
  );
}

function PickUpScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-300 via-rose-200 to-pink-100" />
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-5xl">💕</div>
      <div className="absolute top-[10%] left-[10%] text-xl animate-float-slow">🌸</div>
      <div className="absolute top-[8%] right-[12%] text-lg animate-float-slower">🌸</div>
    </>
  );
}

function PutAwayScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-400 via-stone-300 to-gray-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[25%]">
        <svg viewBox="0 0 400 80" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <rect x="80" y="10" width="240" height="70" rx="6" fill="#475569" opacity="0.3" />
          <polygon points="200,0 60,20 340,20" fill="#475569" opacity="0.35" />
          <rect x="180" y="35" width="40" height="45" rx="3" fill="#92400e" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-[10%] right-[15%] text-xl animate-float-slow">🎒</div>
      <div className="absolute top-[12%] left-[12%] text-lg animate-float-slower">👟</div>
    </>
  );
}

function ScreenTimeScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500 via-purple-400 to-indigo-300" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/15 animate-float-slower"
          style={{
            width: 12 + i * 8,
            height: 12 + i * 8,
            left: `${10 + (i * 17) % 80}%`,
            top: `${15 + (i * 23) % 50}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <div className="absolute bottom-[15%] left-[12%] text-3xl">🎮</div>
      <div className="absolute bottom-[15%] right-[12%] text-3xl">📱</div>
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-lg animate-float-slow">✨</div>
    </>
  );
}

function PhysicalFunScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-emerald-300 to-lime-200" />
      <div className="absolute top-[5%] right-[10%] text-3xl">☀️</div>
      <div className="absolute bottom-0 left-0 right-0 h-[25%]">
        <svg viewBox="0 0 400 80" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path d="M0,40 Q100,10 200,35 Q300,60 400,25 L400,80 L0,80 Z" fill="#166534" opacity="0.2" />
        </svg>
      </div>
      <div className="absolute bottom-[20%] left-[8%] text-2xl animate-float-slow">🌳</div>
      <div className="absolute bottom-[18%] right-[8%] text-2xl animate-float-slower">🌳</div>
      <div className="absolute bottom-[30%] left-[30%] text-lg animate-bounce-gentle">⚾</div>
      <div className="absolute bottom-[28%] right-[25%] text-lg animate-float-slow">🚴</div>
    </>
  );
}

function DailyChoreScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-yellow-300 to-orange-200" />
      <div className="absolute bottom-[15%] left-[15%] text-3xl">🧹</div>
      <div className="absolute bottom-[15%] right-[15%] text-3xl">✨</div>
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
        <div className="relative">
          <span className="text-4xl">🦸</span>
          <div className="absolute -top-1 -right-2 text-lg animate-bounce-gentle">💪</div>
        </div>
      </div>
    </>
  );
}

function KidsChoiceScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-300 to-amber-200" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-400" />
        <div className="absolute top-2 left-0 w-full h-2 bg-orange-400" />
        <div className="absolute top-4 left-0 w-full h-2 bg-yellow-400" />
        <div className="absolute top-6 left-0 w-full h-2 bg-green-400" />
        <div className="absolute top-8 left-0 w-full h-2 bg-blue-400" />
        <div className="absolute top-10 left-0 w-full h-2 bg-purple-400" />
      </div>
      {["📖", "🌳", "🎲", "🧩", "⚾", "🎨", "🚲"].map((e, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: `${5 + i * 13}%`,
            top: `${20 + (i * 19) % 45}%`,
            animationDelay: `${i * 0.4}s`,
            fontSize: 20 + (i % 3) * 6,
            opacity: 0.8,
          }}
        >
          {e}
        </div>
      ))}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-sm font-black tracking-[0.15em] uppercase text-white/80 drop-shadow">
        Your Choice!
      </div>
    </>
  );
}

function DinnerScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-300 to-amber-200" />
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-amber-900/10" />
      <div className="absolute bottom-[15%] left-[10%] text-3xl">🥗</div>
      <div className="absolute bottom-[15%] right-[10%] text-3xl">🥤</div>
      <div className="absolute top-[8%] left-[15%] text-xl animate-float-slow">🕯️</div>
      <div className="absolute top-[10%] right-[18%] text-lg animate-float-slower opacity-80">♨️</div>
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-sm text-white/60">👨‍👩‍👧‍👦</div>
    </>
  );
}

function NightHygieneScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-sky-300 to-blue-200" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-200/50 bg-cyan-100/20 animate-bubble-up"
          style={{
            width: 10 + (i % 4) * 8,
            height: 10 + (i % 4) * 8,
            left: `${8 + (i * 27) % 84}%`,
            bottom: -10,
            animationDelay: `${i * 0.35}s`,
            animationDuration: `${2.5 + (i % 3) * 0.6}s`,
          }}
        />
      ))}
      <div className="absolute top-[8%] right-[12%] text-2xl">🫧</div>
      <div className="absolute top-[10%] left-[10%] text-xl animate-float-slow">✨</div>
      <div className="absolute bottom-[18%] left-[12%] text-3xl">🧼</div>
      <div className="absolute bottom-[18%] right-[12%] text-3xl">🪥</div>
    </>
  );
}

function NightTransitionScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-600 via-purple-400 to-violet-300" />
      <div className="absolute top-[6%] right-[10%]">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full bg-amber-100/80 shadow-[0_0_30px_rgba(251,191,36,0.3)]" />
          <div className="absolute top-0.5 right-0 w-[75%] h-[75%] rounded-full bg-indigo-600/70" />
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle-star"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            top: `${8 + (i * 13) % 40}%`,
            left: `${5 + (i * 19) % 85}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <div className="absolute bottom-[18%] left-[15%] text-3xl">👘</div>
      <div className="absolute bottom-[18%] right-[15%] text-3xl">👕</div>
    </>
  );
}

function BedtimeStoryScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-600 via-orange-400 to-yellow-200" />
      <div className="absolute top-[5%] right-[8%] w-28 h-28 rounded-full bg-amber-200/25 blur-2xl" />
      <div className="absolute top-[6%] right-[12%] text-3xl">💡</div>
      <div className="absolute bottom-[15%] left-[8%] text-3xl">📚</div>
      <div className="absolute bottom-[15%] right-[8%] text-3xl">📖</div>
      <div className="absolute top-[30%] left-[10%] text-xl animate-float-slow opacity-70">✨</div>
      <div className="absolute top-[20%] left-[30%] text-sm animate-float-slower opacity-50">🌟</div>
    </>
  );
}

const SCENE_MAP = {
  "Wake Up Routine": WakeUpScene,
  Breakfast: BreakfastScene,
  "Transition to School": TransitionToSchoolScene,
  School: SchoolScene,
  "Transition From School": TransitionFromSchoolScene,
  Academics: AcademicsScene,
  "Pick up Isla": PickUpScene,
  "Transition / Put Things Away": PutAwayScene,
  "Screen Time": ScreenTimeScene,
  "Physical Fun": PhysicalFunScene,
  "Daily Chore": DailyChoreScene,
  "Kids Choice": KidsChoiceScene,
  Dinner: DinnerScene,
  "Night Hygiene": NightHygieneScene,
  "Night Transition": NightTransitionScene,
  "Bedtime Story": BedtimeStoryScene,
};

export default function ImmersiveBlockCard({
  block,
  tasks,
  yotoPrereqs,
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
  const completedCount =
    tasks?.filter((t) => t.status === "done" || t.status === "accepted")
      .length || 0;

  const isPast = block.phase === "past";
  const isNow = block.phase === "now";
  const isNext = block.phase === "next";

  const SceneComponent = SCENE_MAP[block.label];

  const heroSection = (
    <button
      onClick={() => setExpanded(!expanded)}
      className="relative w-full overflow-hidden text-center active:brightness-95 transition-all"
      style={{ minHeight: 200 }}
    >
      {/* Scene background */}
      {SceneComponent ? <SceneComponent /> : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-200" />
      )}

      {/* Centered content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8 px-6 min-h-[200px] md:min-h-[180px]">
        <div className="text-[64px] md:text-[52px] leading-none mb-2 drop-shadow-lg">
          {block.emoji || "📅"}
        </div>
        <h3 className="text-xl md:text-lg font-bold text-white drop-shadow leading-tight">
          {block.label}
        </h3>
        <p className="text-sm text-white/70 mt-0.5 drop-shadow-sm">{timeRange}</p>

        {block.description && (
          <p className="text-xs text-white/60 italic mt-1.5 max-w-[260px] leading-relaxed drop-shadow-sm">
            {block.description}
          </p>
        )}

        {yotoPrereqs && (
          <YotoMilestone
            prereqTasks={yotoPrereqs}
            label={block.label === "Breakfast" ? "Finish wake-up by 7:00" : "All done by 7:35"}
          />
        )}

        <div className="mt-3">
          <StatusPill
            block={block}
            hasTasks={hasTasks}
            completedCount={completedCount}
            taskCount={tasks?.length || 0}
          />
        </div>

        {/* Chevron */}
        {hasTasks && (
          <span
            className={`mt-2 text-white/50 transition-transform duration-200 text-sm ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        )}
      </div>
    </button>
  );

  const taskList = expanded && hasTasks ? (
    <div className="bg-white/90 backdrop-blur-sm p-3 md:p-2 space-y-2 md:space-y-1 md:overflow-y-auto md:max-h-[320px] lg:max-h-[400px]">
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
  ) : expanded && !hasTasks && block.block_type !== "passive" ? (
    <div className="bg-white/90 p-4 md:p-3 text-center">
      <p className="text-xs text-muted-foreground italic">No tasks — free block</p>
    </div>
  ) : null;

  return (
    <div
      className={`rounded-3xl overflow-hidden transition-all ${
        isPast ? "opacity-40" : ""
      } ${isNow ? "ring-2 ring-blue-400 shadow-xl" : ""} ${
        isNext ? "ring-1 ring-amber-300 shadow-md" : ""
      }`}
    >
      {/* Portrait / narrow */}
      <div className="md:hidden">
        {heroSection}
        {taskList}
      </div>

      {/* Wide: side-by-side when expanded with tasks */}
      <div className="hidden md:block">
        {!expanded || !hasTasks ? (
          <>
            {heroSection}
            {taskList}
          </>
        ) : (
          <div className="flex">
            <div className="w-2/5 shrink-0">
              {heroSection}
            </div>
            <div className="w-3/5 bg-white/90 backdrop-blur-sm p-2 space-y-1 overflow-y-auto max-h-[400px]">
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
          </div>
        )}
      </div>
    </div>
  );
}
